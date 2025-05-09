import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";
import { uploadToCloudinary } from "../config/upload.js";
import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";
import sendMail from "../utils/sendMail.js";
const { JWT_SECRET, BASE_URL } = ENV;

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profileImage } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      profileImage: null,
      isVerified: false,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    newUser.verificationToken = token;
    await newUser.save();

    const link = `${BASE_URL}/verify-email?token=${token}`;
    const html = verifyEmailTemplate(firstName || email, link);

    await sendMail({
      to: email,
      subject: "Verify your Email",
      html,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: { ...userData, token },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const profileImage = req.file ? req.file.buffer : null;
    let dp = null;

    if (profileImage) {
      const res = await uploadToCloudinary(profileImage);
      dp = res?.url;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email }, // filter
      {
        firstName,
        lastName,
        email,
        ...(dp && { profileImage: dp }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.isVerified)
      return res.status(400).json({ message: "Invalid or already verified." });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
