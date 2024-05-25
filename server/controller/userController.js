import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

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



const createUser = asyncHandler(async (req, res) => {
  const { username, mobile, email, password, method } = req.body;

  if (!username || !email || !mobile || !password || !method) {
    res.status(400).json({ message: "Please fill all the inputs." });
    return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    mobile,
    email,
    password: hashedPassword,
    otp: generateOTP(),
    otpExpires: Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
  });

  try {
    // Send OTP based on the preferred method
    if (method === 'email') {
      await sendEmailOTP(email, newUser.otp);
    } else if (method === 'sms') {
      await sendSMSOTP(mobile, newUser.otp);
    } else {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      mobile: newUser.mobile,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      message: `OTP sent via ${method}`
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data", error: error.message });
  }
});






const loginUser = asyncHandler(async (req, res) => {
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
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});



const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});


const getCurrentUserProfile = asyncHandler(async (req, res) => {
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
});


const updateCurrentUserProfile = asyncHandler(async (req, res) => {
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
      message:"User profile updated successfully",
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
});


const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ 
      user:user.username,
      message:  "removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});


const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


const updateUserById = asyncHandler(async (req, res) => {
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
});





export default {createUser,loginUser,logoutCurrentUser,getAllUsers,getCurrentUserProfile,updateCurrentUserProfile,deleteUserById,getUserById,updateUserById }












