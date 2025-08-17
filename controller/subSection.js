const subsection = require("../models/subsection");
const section = require("../models/section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createSubSection = async (req, res) => {
    try {

        //fetch data from request of body
        const {sectionId, title, description} = req.body;

        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !description || !video) {
            return res
                .status(400)
                .json({
                success: false,
                message: 'All Fields are Required',
            });
        }

        //upload video file to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video, 
            process.env.FOLDER_NAME
        );
        console.log(uploadDetails);

        //create a sub-section with necessary information
        const subSectionDetails = await subsection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update corresponding section with newly created sub-section
        const updatedSection = await section.findByIdAndUpdate(
            {_id: sectionId},
            {$push:{ subsection: subSectionDetails._id } },
            {new: true}
        ).populate("subsection")

        //HW: log updated section here, after adding populate query
        //return updated section in the response
        return res.status(200).json({
            succcess: true,
            data: updatedSection,
        })
        
    } catch (error) {
        //Handle any error that may occur duing the process
        console.error("Error crating a new sub-section: ", error);
        return res.status(500).json({
            succcess: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

//update the sub-section
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description } = req.body;

    const subSection = await subsection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }


    if (title !== undefined){
        subSection.title = title;
    }
        
        

    if (description !== undefined) {
        subSection.description = description;
    }

    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    return res.json({
      success: true,
      message: "SubSection updated Successfully",
      data: subSection,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the SubSection",
    });
  }
};



exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subsection: subSectionId } }  // must match schema
    );

    const deletedSubSection = await subsection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection Not Found",
      });
    }

    return res.json({
      success: true,
      message: "SubSection Deleted Successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Error Occurred While Deleting the SubSection",
    });
  }
};


