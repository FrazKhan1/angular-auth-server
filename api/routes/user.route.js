import express from "express";
import { register, login, profile } from "../controllers/user.controller.js";
import upload from "../config/upload.js";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", auth, upload.single("profileImage"), profile);

export default router;
