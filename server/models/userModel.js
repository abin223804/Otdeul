import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,

    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
     default: false,
    },
    otp: { type: String },
    
    isVerified: { type: Boolean, default: false },

  

  },

  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
