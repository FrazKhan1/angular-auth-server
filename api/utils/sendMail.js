import nodemailer from "nodemailer";
import { ENV } from "../config/env.config.js";
const { EMAIL_USER, EMAIL_PASS } = ENV;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"My App" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new Error("Email sending failed");
  }
};

export default sendMail;
