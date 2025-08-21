const Subsection = require("../models/subsection");
const Section = require("../models/section");
const {imageUploader} = require("../utils/imageUploader");


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
        const uploadDetails = await imageUploader(
            video, 
            process.env.FOLDER_NAME
        );
        console.log(uploadDetails);

        //create a sub-section with necessary information
        const subSectionDetails = await Subsection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        //update corresponding section with newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {$push:{ subsection: subSectionDetails._id } },
            {new: true}
        ).populate("subsection")

        console.log(updatedSection);

        console.log("sectionId received:", sectionId);
        console.log("SubSection created:", subSectionDetails);
        console.log("Updated Section after push:", updatedSection);


        //HW: log updated section here, after adding populate query
        //return updated section in the response

        return res.status(200).json({
            success: true,
            data: updatedSection,
        })
        
    } 
    catch (error) {
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
    const { subsectionId, title, description } = req.body;

    const subsection = await Subsection.findById(subsectionId);

    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }


    if (title !== undefined){
        subsection.title = title;
    }
        
    if (description !== undefined) {
        subsection.description = description;
    }

    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await imageUploader(
        video,
        process.env.FOLDER_NAME,
      );
      
      subsection.videoUrl = uploadDetails.secure_url;
      subsection.timeDuration = `${uploadDetails.duration}`;
    }

    await subsection.save();

    return res.json({
      success: true,
      message: "SubSection updated Successfully",
      data: subsection,
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the Subsection",
    });
  }
};



exports.deleteSubSection = async (req, res) => {
  try {
    const { subsectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subsection: subsectionId } }  // must match schema
    );

    const deletedSubSection = await Subsection.findByIdAndDelete(subsectionId);

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

  } 

  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Error Occurred While Deleting the SubSection",
    });
  }
};



