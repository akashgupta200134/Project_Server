const OTP = require("../models/otp");
const User = require("../models/user");
const otpGenerator = require("otp-generator");

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

  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
