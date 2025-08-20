const mongoose = require("mongoose");

const RatingandReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",  // reference Course model
  },

  rating: {
    type: Number,   // changed to Number for sorting and aggregation
    required: true,
  },
  
  reviews: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("RatingAndReview", RatingandReviewSchema);
