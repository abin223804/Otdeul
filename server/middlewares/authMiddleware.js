import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import asyncHandler from "./asyncHandler.js";

// Middleware to authenticate the user
const authenticateUser = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found.",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed.",
      error: error.message,
    });
  }
});

// Middleware to authenticate the admin
const authenticateAdmin = asyncHandler(async (req, res, next) => {
  let token = req.cookies['admin-token'];

  console.log("Admin Token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.admin = await Admin.findById(decoded.adminId).select("-password");
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, admin not found.",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed.",
      error: error.message,
    });
  }
});

// Middleware to authorize admin access
const authorizeAdmin = (req, res, next) => {
  if (req.admin) {
    next();
  } else if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Not authorized as an admin.",
    });
  }
};

export { authenticateUser, authenticateAdmin, authorizeAdmin };
