const course = require("../models/course");
const category = require("../models/category");
const user = require("../models/user");
const imageUploader = require("../utils/imageUploader");

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

    const thumbnail = req.files.thumbnailImage;

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



    





  } 
  
  
  
  catch (error) {}
};
