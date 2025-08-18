const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  gender: {
    type: String,
    trim: true,
  },

  profession: {
    type: String,
    trim: true,
  },

  dateofBirth: {
    type: String,
    trim: true,
  },

  about: {
    type: String,
  },

  contactNumber: {
    type: String,
  },


});

module.exports = mongoose.model("profile", ProfileSchema);
