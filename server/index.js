import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(cookieParser());

app.use("/user", userRoute);

const PORT = process.env.PORT || 8000;

connectDB();
app.listen(PORT, () => {
  console.log(chalk.cyan("Server is running " + PORT));
});
