const { default: mongoose } = require("mongoose");
const course = require("../models/course");
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

    //return response
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





// find average rating function
exports.createratingandreviews = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await ratingandReviews.aggregate([
      {
        $match: { course: new mongoose.Types.ObjectId(courseId)},
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);


    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: " average rating fetch successfully",
        averageRating: result[0].averageRating,
        totalReviews: result[0].totalReviews,
      });
    }
     else {
      return res.status(200).json({
        success: true,
        message: "No ratings yet for this course",
        averageRating: 0,
        totalReviews: 0,
      });
    }
  }

   catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "something went wrong while fetching aggregate Rating and reviews",
    });
  }
};


exports.createratingandreviews = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await ratingandReviews.find({}).sort({rating : -1}).populate({
        path : "User",
        select : "firstName lastName email image"
    }).populate({
        path : "Course",
        select : "courseName"
    })
    .exec();



    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: " average rating fetch successfully",
        averageRating: result[0].averageRating,
        totalReviews: result[0].totalReviews,
      });
    }
    
     else {
      return res.status(200).json({
        success: true,
        message: "No ratings yet for this course",
        averageRating: 0,
        totalReviews: 0,
      });
    }
  }

   catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "something went wrong while fetching aggregate Rating and reviews",
    });
  }
};