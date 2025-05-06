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
    origin: (origin, callback) => {
      const allowed = ["http://localhost:4200", "https://angular-auth-client.vercel.app"];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.options("*", cors()); // handle preflight


app.use("/api", userRoutes);
app.use('/uploads', express.static('uploads'));


const port = PORT;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
