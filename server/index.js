import express from "express";
import chalk from "chalk";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import "./config/auth.js";

const app = express();

import dotenv from "dotenv";
import connectDB from "./config/db.js";

// routes
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import addressRoute from "./routes/addressRoute.js";

dotenv.config();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/address", addressRoute);

const PORT = process.env.PORT || 8000;

connectDB();
app.listen(PORT, () => {
  console.log(chalk.cyan("Server is running " + PORT));
});
