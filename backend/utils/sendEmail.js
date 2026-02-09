import nodemailer from "nodemailer";

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT), // 🔥 IMPORTANT
    secure: false, // 🔥 REQUIRED for Mailtrap
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Music App <hello@musicapp.com>",
    to,
    subject,
    html,
  });
};

export default sendMail;
