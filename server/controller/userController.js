import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import axios from "axios";
import otpGenerator from "otp-generator";

const generateOTP = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  specialChars: false,
});

const sendOtp = asyncHandler(async (req, res) => {
  const { username, email, mobile, password } = req.body;

  if (!username || !email || !mobile || !password) {
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

  const otp = generateOTP();
  console.log(otp);

  try {
    // Send OTP via FastToSMS
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: `Your OTP for registration is: ${otp}`,
        language: "english",
        flash: 0,
        numbers: mobile,
        sender_id: "FSTSMS",
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.return !== true) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with OTP and unverified status
    const newUser = new User({
      username,
      mobile,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });
    await newUser.save();

    res.status(201).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Error sending OTP" });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number and OTP are required" });
  }

  const user = await User.findOne({ mobile });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid mobile number" });
  }

  if (user.otp === otp) {
    user.isVerified = true;
    user.otp = undefined; // Clear OTP after verification

    const token = user.generateJWT();

    await user.save();
    res.json({ success: true, message: "OTP verified successfully", token });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
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

  if (!user || !user.isVerified) {
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

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
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
};
