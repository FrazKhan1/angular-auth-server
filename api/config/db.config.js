import mongoose from "mongoose";
import dotenv from "dotenv";
import { ENV } from "./env.config.js";
const { MONGODB_URI } = ENV;
dotenv.config();

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(MONGODB_URI);
    if (connect) console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
