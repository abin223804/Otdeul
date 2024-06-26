import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import fast2sms from "fast-two-sms";
import axios from "axios";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import FormData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);

const apiKey = process.env.MAILGUN_API_KEY;

const fas2smsApi_key = process.env.FAST2SMS_API_KEY;
const fas2smsEntity_Id = process.env.ENTITY_ID;

console.log("fast2smsApi_key", fas2smsApi_key);
console.log("entityid", fas2smsEntity_Id);

console.log("apikey", apiKey);

const mg = mailgun.client({
  username: "api",
  key: apiKey || "key-yourkeyhere",
});

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
      return res.status(500).json({
        success: false,
        message: "Internal server error. Please contact support.",
      });
    }

    if (
      !process.env.MAILGUN_API_KEY ||
      !process.env.MAILGUN_DOMAIN ||
      !process.env.MAILGUN_EMAIL_SENDER
    ) {
      console.error("Missing required environment variables for Mailgun");
      return res.status(500).json({
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
          return res.status(500).json({
            success: false,
            message: response.data.message || "Error sending OTP via Fast2SMS",
          });
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
    const { otp, email } = req.body;
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
    res.status(500).json({ message: error.messages });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the inputs.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isVerified || user.isBlocked || user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials or user not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_USER,
        { expiresIn: "30d" }
      );

      res.cookie("user-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return res.status(200).json({
        _id: user._id,
        username: user.username,
        mobile: user.mobile,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the inputs.",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isVerified || !admin.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials or admin not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    console.log("ismatch");

    if (isMatch) {
      const generateAdminToken = () => {
        const payload = {
          adminId: admin._id,
        };

        const options = {
          expiresIn: "30d",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, options);
        return token;
      };

      const token = generateAdminToken();
      res.cookie("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        _id: admin._id,
        username: admin.username,
        mobile: admin.mobile,
        email: admin.email,
        isAdmin: admin.isAdmin,
        token: token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

const getAdminData = asyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided or incorrect format");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided or incorrect format",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Log the JWT secret key just before verifying the token
    console.log("JWT_SECRET_ADMIN:", process.env.JWT_SECRET_ADMIN);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    console.log("Decoded Token:", decoded);

    const admin = await Admin.findById(decoded.adminId); // Adjust to match your admin model
    console.log("Admin:", admin);

    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    console.log("Admin found");
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Error during token verification or admin retrieval:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
      error: error.message,
    });
  }
});



const getUserData = asyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided or incorrect format");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided or incorrect format",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token provided"); 
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Log the JWT secret key just before verifying the token
    console.log("JWT_SECRET_ADMIN:", process.env.JWT_SECRET_USER);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId); // Adjust to match your admin model
    console.log("User:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User found");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error during token verification or admin retrieval:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
      error: error.message,
    });
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
      return res
        .status(400)
        .json({ error: "No account with that email address exists." });
    }

    const otpp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    existingUser.resetToken = otpp;
    existingUser.resetPasswordExpires = Date.now() + 3600000;

    console.log(`Generated OTP for ${email}: ${otpp}`);

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
      message: "Please check your email for the OTP to reset your password.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const verifyOtpAndResetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || otp === undefined || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and new password are required." });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: "No account with that email address exists." });
    }

    console.log(`Stored OTP: ${existingUser.resetToken}`);
    console.log(`Provided OTP: ${otp}`);

    if (existingUser.resetToken !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    if (existingUser.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    existingUser.password = await bcrypt.hash(newPassword, salt);

    existingUser.resetToken = undefined;
    existingUser.resetPasswordExpires = undefined;

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }

      res.clearCookie("jwt");

      res.clearCookie("connect.sid");

      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during logout" });
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

    console.log("Existinguser", existingUser);

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

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    existingUser.password = hash;
    existingUser.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed.please try again",
    });
  }
});

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
  loginAdmin,
  requestForgotPassword,
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
  resetPassword,
  getAdminData,
  getUserData,
};
