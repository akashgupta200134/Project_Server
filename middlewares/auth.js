const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

// auth

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        messgae: "Token is not found",
      });
    }

    // decode token  and verify

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.User = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "something went wrong while verfiying the token",
    });
  }
};


//isStudent


exports.isStudent = async (req, res, next) => {
  try {
    if(req.User.accountType !== "Student"){
        return res.status(401).json({
        success: false,
        messgae: "You are not a student",
      });
    }

    next();

  }
   catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role can not be verified, Please try again",
    });
  }
};


//isAdmin

exports.isAdmin = async (req, res, next) => {
  try {
    if(req.User.accountType !== "Admin"){
        return res.status(401).json({
        success: false,
        messgae: "You are not a Admin",
      });
    }

    next();

  }
   catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role can not be verified, Please try again",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if(req.User.accountType !== "Instructor"){
        return res.status(401).json({
        success: false,
        messgae: "You are not a Instructor",
      });
    }

    next();

  }
   catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User role can not be verified, Please try again",
    });
  }
};

