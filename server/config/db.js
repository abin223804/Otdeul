import mongoose  from "mongoose";
import chalk from "chalk";


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(chalk.green("MongoDb connected successfully"));
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
