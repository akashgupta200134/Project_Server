const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      required: true,
      enum: ["Admin", "Student", "Instructor"],
    },

    additionalDetials: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "profile",
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    image: {
      type: String,
      required: false,
    },

    token: {
      type: String,
    },

    Resetpasswordexpires: {
      type: Date,
      select: false,
    },

    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress", 
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
