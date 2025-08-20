const OTP = require("../models/otp");
const User = require("../models/user");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/profile");
const jwt = require("jsonwebtoken");
const sendMailer = require("../utils/mailSender");


//Send otp function
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserpresent = await User.findOne({ email });
    if (checkUserpresent) {
      return res.status(401).json({
        messsage: "This email is already registred",
        success: false,
      });
    }

    //generete otp
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp is", otp);

    // genenrate otp till get the unique which not used earlier
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      let otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    // create entry in database
    const OtpPayload = { email, otp };
    const otpbody = await OTP.create(OtpPayload);
    console.log(otpbody);

    // retrun sucessfull response
    res.status(200).json({
      success: true,
      messsage: "Otp sent Sucessfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup function
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      confirmPassword,
      contactNumber,
      otp,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !email ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // verify passoword
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password Not matched",
      });
    }

    // check registred user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "User is already registred",
      });
    }

    // fetch the recent otp from db
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent otp is ", recentOtp);

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (recentOtp[0].otp !== otp) {
    return res.status(404).json({
      success: false,
      message: "Invalid Otp",
    });
}

    

    // encrypt the passord
    const hashedPassword = await bcrypt.hash(password, 10);

    let approved = accountType === "Instructor" ? false : true;

    // create entry in database
    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      profession: null,
      contactNumber: null,
      about: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetials: profileDetails._id,
      contactNumber,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User Registred Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while Registering user, please try again",
    });
  }
};

/// login Function
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    //validation of data
    if (!email || !password) {
      //Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    //check user exists or not
    const user = await User.findOne({ email }).populate("additionalDetials");
    if (!user) {
      return res.status(401).json({
        //Return 401 unauthorized status code with error message
        success: false,
        message: `User is not registered with Us, Please signup to Continue`,
      });
    }
    //Generate JWT, after password match
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      //save token to user document in database
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password Is Incorrect`,
      });
    }
  } catch (error) {
    console.log(error);
    //Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

///change password
exports.changepassword = async (req, res) => {
  try {
    const { email, oldpassword, newpassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User not Found, please signup first",
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();

    const changepasswordemail = await sendMailer(
      email,
      "Password Change Confirmation",
      "<h3>Your password has been changed successfully</h3>"
    );

    console.log("Password change email sent:", changepasswordemail.messageId);

    return res.status(200).json({
      success: true,
      message: "Password change Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while changing the password, please try again",
    });
  }
};
