import express from "express";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import { ENV } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
const { PORT } = ENV;

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:4200",
    "https://angular-auth-client.vercel.app",
    "https://angular-auth-client.vercel.app/",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use("/api", userRoutes);
app.use('/uploads', express.static('uploads'));

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;