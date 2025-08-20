const nodeMailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`, // must match authenticated user
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Mail error:", error.message);
  }
};

module.exports = mailSender;
