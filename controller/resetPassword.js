const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const sendMail = require("../utils/mailSender");

exports.resetPassword = async (req, res) => {
    
  try {

    const email = req.body.email;
    const existinguser = await User.findOne({ email: email });

    if (!existinguser) {
      return res.status(500).json({
        success: false,
        message: "This email is not registred with Us",
      });
    }

    const token = crypto.randomUUID();

    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        Resetpasswordexpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    const url = `http://localhost:3000/update-password/${token}`;


    await mailSender(
      email,
      "Password reset Link",
      `Password reset Link : ${url}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Email sent Successfully, please check email and change the password",
    });
  } 
  
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password, Please try again",
    });
  }
};
