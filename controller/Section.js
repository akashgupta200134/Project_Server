const Section = require("../models/section");
const course = require("../models/course");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: `All fields are required`,
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatecourseDetails = await course
      .findByIdAndUpdate(
        courseId,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true }
      )
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

    //populate section and subsection

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatecourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating Section",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: `All fields are required`,
      });
    }
    const newSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });

  }
   catch (error) {
    return res.status(500).json({
      success: true,
      message: "Something went wrong while updating the Section",
      error : error.message
    });

  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required",
      });
    }

    // Delete the section
    await Section.findByIdAndDelete(sectionId);


    // Remove reference from courseContent
    await course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the Section",
      error: error.message,
    });
  }
};

