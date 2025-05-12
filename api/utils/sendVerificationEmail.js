import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";
import sendMail from "./sendMail.js";
import { ENV } from "../config/env.config.js";
const { JWT_SECRET  , BASE_URL } = ENV;

export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

  user.verificationToken = token;
  await user.save();

  const link = `${BASE_URL}/verify-email?token=${token}`;
  const html = verifyEmailTemplate(user.firstName || user.email, link);

  await sendMail({
    to: user.email,
    subject: "Verify your Email",
    html,
  });
};
