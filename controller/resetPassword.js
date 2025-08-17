const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password, Please try again",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // verify password
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "passwords are not matching",
      });
    }

    // verfiy token
    const userDetials = await User.findOne({ token: token });
    if (!userDetials) {
      return res.status(400).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    // token time check
    if (userDetials.Resetpasswordexpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired, please regenerate your token",
      });
    }

    // hased password

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      {
        token: token,
      },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password change Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting password, Please try again",
    });
  }
};
