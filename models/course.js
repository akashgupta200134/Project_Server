const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
  },

  courseDescription: {
    type: String,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  whatyouwilllearn: {
    type: String,
  },

  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
    },
  ],

  ratingandReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratingandreviews",
    },
  ],

  price: {
    type: Number,
  },

  thumbnail: {
    type: String,
  },

  tags: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tags",
  },

  studentenrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Course", CourseSchema);
