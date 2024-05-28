import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import axios from "axios";

// default register system  👇
// const createUser = asyncHandler(async (req, res) => {
//   const { username,mobile, email, password } = req.body;

//   if (!username || !email || !mobile  || !password) {
//     throw new Error("Please fill all the inputs.");
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) res.status(400).send("User already exists");

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const newUser = new User({ username,mobile, email, password: hashedPassword });

//   try {
//     await newUser.save();
//     createToken(res, newUser._id);

//     res.status(201).json({
//       _id: newUser._id,
//       username: newUser.username,
//       mobile: newUser.mobile,
//       email: newUser.email,
//       isAdmin: newUser.isAdmin,
//     });
//   } catch (error) {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number is required" });
  }

  const otp = generateOTP();

  try {
    // Send OTP via FastToSMS
    await axios.post(
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

    const user = await User.findOne({ mobile });

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      const newUser = new User({ mobile, otp });
      await newUser.save();
    }

    res.json({ success: true, message: "OTP sent successfully" });
    console.log(otp);
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
    await user.save();
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

const createUser = asyncHandler(async (req, res) => {
  try {
    const { username, mobile, email, password } = req.body;

    if (!username || !email || !mobile || !password) {
      throw new Error("Please fill all the inputs.");
    }

    const user = await User.findOne({ mobile });

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile number not verified" });
    }

    if (user && user.email) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    await user.save();

    createToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error(error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (isPasswordValid) {
        createToken(res, existingUser._id);

        res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
        });
        return;
      }
    }
  } catch (error) {
    console.error(error);
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
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
