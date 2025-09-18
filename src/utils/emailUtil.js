import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Password Reset",
    text: `Your OTP is ${otp}. Expires in 10 minutes.`
  });
};
