import express from "express";
import { connectDB } from "./config/db.config.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api", userRoutes);

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
