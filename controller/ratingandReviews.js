const course = require("../models/course");
const User = require("../models/user");
const ratingandReviews = require("../models/ratingreview");

// create ratingand reviews function

exports.createratingandreviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, reviews, courseId } = req.body;

    const courseDetails = await course.findOne({
      _id: courseId,
      studentenrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "User not enrolled in this Course",
      });
    }

    // check if  user alreday rate and review

    const alreadyratingreview = await ratingandReviews.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyratingreview) {
      return res.status(403).json({
        success: false,
        message: "user already given rating and reviwed",
      });
    }

    // create rating and review
    const ratingReview = await ratingandReviews.create({
      rating,
      reviews,
      course: courseId,
      user: userId,
    });

    
    // update course with rating andreviews
    const updateCourseDetails = await course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingandReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    console.log(updateCourseDetails);


    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });




  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "something went wrong while creating Rating and reviews",
    });
  }
};
