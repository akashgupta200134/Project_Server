const OTP = require("../models/otp");
const user = require("../models/user");
const User = require("../models/user");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/profile");
const jwt = require("jsonwebtoken");



//Send otp function
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserpresent = User.findOne({ email });
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
exports.signUp = async (req, res) => {
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

    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (recentOtp != otp) {
      return res.status(404).json({
        success: false,
        message: "Invalid Otp",
      });
    }

    // encrypt the passord
    const hashedPassword = await bcrypt.hash(password, 10);

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
      accountType,
      additionalDetials: profileDetails,
      contactNumber,
      imageUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User Registred Successfully",
      user,
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
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "User not Found, please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };

      const Token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.Token = Token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", Token, options).status(200).json({
        success: true,
        user,
        Token,
        message: "Logged In Successfully",
      });
    }
    
    else {
      return res.status(403).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  }
   catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while Login, please try again",
    });
  }
};
