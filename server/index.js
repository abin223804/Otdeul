import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoute from "./routes/userRoute";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);

const PORT = 8080 || process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("connect to DB");
    console.log("Server is running " + PORT);
  });
});
