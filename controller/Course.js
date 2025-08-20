const course = require("../models/course");
const category = require("../models/category");
const User = require("../models/user");
const { imageUploader } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatyouwilllearn,
      price,
      category,
      instructor,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatyouwilllearn ||
      !price ||
      !category ||
      !instructor ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // get userid

    const user_id = req.user.id;

    const instructorDetails = await User.findById({ user_id });

    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instrctor Details not found",
      });
    }

    const categoryDetails = await category.findById(category);

    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Category Details not found",
      });
    }

    // upload thumbnail to cloudinary

    const uploadthumnail = await imageUploader(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // create enrty for courses

    const newcourse = await course.create({
      courseName,
      courseDescription,
      whatyouwilllearn: whatyouwilllearn,
      price,
      category: categoryDetails._id,
      instructor: instructorDetails._id,
      thumbnail: uploadthumnail.secure_url,
    });

    // add newcourse to the user schema inside the instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newcourse._id,
        },
      },
      { new: true }
    );

    // update cateogry
    await category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newcourse._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newcourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//getAllCourses handler function
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await course
      .find(
        {},
        {
          courseName: true,
          courseDescription: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingandReviews: true,
          studentenrolled: true,
          whatyouwilllearn: true,
        }
      )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all Courses Fetched Successfully",
      data: allCourses,
    });


  }catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Cannot Fetch Course Data`,
      error: error.message,
    });
  }
};


exports.getCourseDetails = async (req, res) => {

    try {
        //get id
        const {courseId} = req.body;

        //find course details
        const courseDetails = await course.find(
            {_id:courseId}
        ).populate(
            {
                path: "Instructor",
                populate:{
                    path: "additionalDetials",
                },
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate:{
                path: "subsection",
            },
        })
        .exec();

        //validation
        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully",
            data: courseDetails,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};