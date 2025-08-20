const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../templets/emailtemplet")

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  // ✅ use Date.now (not Date.now())
    expires: 5 * 60,    // document expires after 5 minutes
  },
});

// Function to send verification email
async function sendEmailVerification(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp)
    );
    console.log("Email sent successfully:", mailResponse.messageId);
  } catch (error) {
    console.log("Error occurred while sending email:", error.message);
    throw error;
  }
}

// Pre-save hook
OtpSchema.pre("save", async function (next) {
  await sendEmailVerification(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OtpSchema);
