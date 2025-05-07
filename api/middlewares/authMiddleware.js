import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access deined",
      });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Invalid token.", error: error.message });
  }
};
