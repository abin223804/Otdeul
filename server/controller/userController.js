import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import otpGenerator from "otp-generator";
import fast2sms from "fast-two-sms";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();



import FormData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(FormData);

const apiKey= process.env.MAILGUN_API_KEY  

const fas2smsApi_key = process.env.FAST2SMS_API_KEY
const fas2smsEntity_Id = process.env.ENTITY_ID 


console.log("fast2smsApi_key",fas2smsApi_key); 
console.log("entityid",fas2smsEntity_Id); 


console.log("apikey",apiKey);

const mg = mailgun.client({username: 'api', key: apiKey|| 'key-yourkeyhere'});



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
          entity_id: process.env.ENTITY_ID,
          flash: "0",
          language: "english",
        };

        console.log("Sending request to Fast2SMS with options:", options);

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
    
        if (response.data.return) {
          console.log("Response from Fast2SMS:", response.data);
        } else {
          console.error("Error from Fast2SMS:", response.data);
          return res.status(500).json({ success: false, message: response.data.message || "Error sending OTP via Fast2SMS" });
        }

      } else if (preference === "email") {
        const emailData = {
          from: `Otdeul <${process.env.MAILGUN_EMAIL_SENDER}>`,
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP for registration is: ${otp}`, 
        }; 


        const message = await mg.messages.create(
          process.env.MAILGUN_DOMAIN,
          emailData
        );
        console.log("Email sent via Mailgun:", message);
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

  try {
    const { otp ,email} = req.body;
  if (!email || !otp) {
    throw new Error("Mobile number and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email");
  }

  if (user.otp === otp) {
    user.isVerified = true;
    user.otp = undefined; 

    await user.save();
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    throw new Error("Invalid OTP");
  }
    
  } catch (error) {
    res.status(500).json({ message:error.messages});
    
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


const requestForgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "You must enter an email address" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "No account with that email address exists." });
    }

    const otpp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    existingUser.resetToken = otpp
    existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    console.log(`Generated OTP for ${email}: ${otpp}`);  // Log OTP for debugging

    await existingUser.save();

    const emailData = {
      from: `Otdeul <${process.env.MAILGUN_EMAIL_SENDER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for password reset is: ${otpp}`, 
    };

    const message = await mg.messages.create(
      process.env.MAILGUN_DOMAIN,
      emailData
    );
    console.log("Email sent via Mailgun:", message);

    res.status(200).json({
      success: true,
      message: "Please check your email for the OTP to reset your password."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


const verifyOtpAndResetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || otp === undefined || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "No account with that email address exists." });
    }

    console.log(`Stored OTP: ${existingUser.resetToken}`);
    console.log(`Provided OTP: ${otp}`);

    if (existingUser.resetToken !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    if (existingUser.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(newPassword, salt);
    
    // Clear the reset token and expiry
    existingUser.resetToken = undefined;
    existingUser.resetPasswordExpires = undefined;

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Your request could not be processed. Please try again.'
    });
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
  requestForgotPassword ,
  verifyOtpAndResetPassword,
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
