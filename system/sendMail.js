const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (receiver, user, secretKey) => {
  console.log(receiver, user, secretKey);

  const resetUrl = `http://localhost:3000/reset-password?token=${secretKey}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: "Password Reset",
    text: `
        <h1>Hi ${user.name},</h1>\n
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  try {
    const mail = await transporter.sendMail(mailOptions);
    return mail;
    console.log("rest link email sent to:", receiver);
  } catch (error) {
    console.error("Error sending account lock email:", error);
  }
};

module.exports = { sendMail };
