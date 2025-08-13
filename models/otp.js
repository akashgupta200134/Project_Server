const mongoose = require("mongoose");

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
    default: Date.now(),
    expires: 5 * 60,
  },
});



/// function to send emails
async function sendemailVerification(email, otp) {
  try {
    const mailresponse = await mailSender( email, "Verification email from Akash", otp);
    console.log("email Sent Successfully", mailresponse);


  } catch (error) {
    console.log("Error occcured while sending email", error);
    throw error;
  }
}



OtpSchema.pre("save", async function (next) {
  await sendemailVerification(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OtpSchema);
