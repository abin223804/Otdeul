import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import otpGenerator from "otp-generator";
import fast2sms from "fast-two-sms";
import axios from "axios";
import dotenv from "dotenv";
import * as FormData from 'form-data'; // Import FormData for specifying form data in HTTP requests
import Mailgun from 'mailgun.js';

// Initialize Mailgun with your configuration options
const mailgun = new Mailgun({
  FormData: FormData, 
  username:'api',
  key: process.env.MAILGUN_API_KEY ,
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
     username:"api",
     password:"121212"
    }
  },
});


// const mg = mailgun.client();








const sendOtp = asyncHandler(async (req, res) => {
  try {
    const { username, email, mobile, password, preference } = req.body;

    if (!username || !email || !mobile || !password || !preference) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the inputs." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const userMobileExists = await User.findOne({ mobile });
    if (userMobileExists) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile number already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(`Generated OTP: ${otp}`);

    if (!process.env.FAST2SMS_API_KEY || !process.env.SENDER_ID) {
      console.error("Missing required environment variables for Fast2SMS");
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error. Please contact support.",
        });
    }

    if (
      !process.env.MAILGUN_API_KEY||
      !process.env.MAILGUN_DOMAIN ||
      !process.env.MAILGUN_EMAIL_SENDER
    ) {
      console.error("Missing required environment variables for Mailgun");
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error. Please contact support.",
        });
    }

    try {
      if (preference === "mobile") {
        const options = {
          message: `Your OTP for registration is: ${otp}`,
          numbers: [mobile],
          route: "dlt",
          sender_id: process.env.SENDER_ID,
          flash: "0",
          language: "english",
        };

        const response = await axios.post(
          "https://www.fast2sms.com/dev/bulkV2",
          options,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: process.env.FAST2SMS_API_KEY,
            },
          }
        );

        console.log("Response from Fast2SMS:", response.data);
      } else if (preference === "email") {
        const emailData = {
          from: `MERN Store! <${process.env.MAILGUN_EMAIL_SENDER}>`,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP for registration is: ${otp}`,
        };

        // const message = await mg.messages.create(
        //   process.env.MAILGUN_DOMAIN,
        //   emailData
        // );
        // console.log("Email sent via Mailgun:", message);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        mobile,
        email,
        password: hashedPassword,
        otp,
        isVerified: false,
      });

      await newUser.save();

      return res.json({ success: true, message: "OTP sent successfully", otp });
    } catch (error) {
      if (error.response) {
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      return res
        .status(500)
        .json({ success: false, message: "Error sending OTP" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    throw new Error("Mobile number and OTP are required");
  }

  const user = await User.findOne({ mobile });

  if (!user) {
    throw new Error("Invalid mobile number");
  }

  if (user.otp === otp) {
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification

    await user.save();
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    throw new Error("Invalid OTP");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the inputs." });
  }

  const user = await User.findOne({ email });

  if (!user || !user.isVerified || user.isBlocked) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials or user not verified",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    createToken(res, user._id);
    res.json({
      _id: user._id,
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid credentials" });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
  }
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error(error);
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updatedUser = await user.save();

      res.json({
        message: "User profile updated successfully",
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        email: updatedUser.mobile,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error.message);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const email = req.user.email;

    console.log(email);

    if (!email) {
      return res.status(401).send("Unauthenticated");
    }

    if (!oldPassword) {
      return res.status(400).json({ error: "You must enter a password" });
    }

    const existingUser = await User.findOne({ email });

    console.log("Existinguser",existingUser);

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use" });
    }

    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Please enter your your correct old password" });
    }

const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(newPassword,salt);
existingUser.password=hash;
existingUser.save();

res.status(200).json({
  success:true,
  message:'Password changed successfully. Please login with your new password'
})

  } catch (error) {
  res.status(400).json({
    error:'Your request could not be processed.please try again'
  })
  }
});


//forgot password









// for admin

const deleteUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Cannot delete admin user");
      }

      await User.deleteOne({ _id: user._id });

      res.json({
        user: user.username,
        message: "removed",
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error(error);
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error);
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error.message);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
  }
});

const getUsersCount = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users.length);
  } catch (error) {
    console.error(error);
  }
});

const BlockUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({ message: "User blocked  successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;

    await user.save();

    res.status(200).json({ message: "User Unblocked  successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default {
  sendOtp,
  verifyOtp,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  BlockUser,
  unBlockUser,
  getUsersCount,
  resetPassword ,
};
