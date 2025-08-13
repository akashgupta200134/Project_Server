const nodeMailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    let info = await transporter.sendMail({
      from: "Akash Gupta",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
     
    console.log(info);
    return info;
    


  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;