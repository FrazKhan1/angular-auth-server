import express from "express";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import { ENV } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
const { PORT } = ENV;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200", "https://angular-auth-client.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api", userRoutes);
app.use('/uploads', express.static('uploads'));


const port = PORT;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
