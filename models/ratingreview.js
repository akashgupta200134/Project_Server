const mongoose = require("mongoose");

const RatingandReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  rating: {
    type: String,
    required: true,
  },

  reviews: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ratingandreviews", RatingandReviewSchema);
