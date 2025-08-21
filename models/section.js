const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },


   subsection: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"subsection",    
        }
    ],




  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",   // optional, but helps track parent course
  }
});

module.exports = mongoose.model("section", SectionSchema);

