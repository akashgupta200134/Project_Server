const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },

  subsection: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: "subsection"
  },

 


});

module.exports = mongoose.model("section", SectionSchema);
