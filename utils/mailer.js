import nodemailer from "nodemailer";

const sendEmail = async (email, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export { sendEmail, generateOtp };
