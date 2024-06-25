


import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; // Import jwt for generating tokens

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: false, // Not required for OAuth
    },
    password: {
      type: String,
      required: false, // Not required for OAuth
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Method to generate JWT
userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.mobile,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

const userModel = mongoose.model("User", userSchema); // Create User model

export default userModel; // Export User model
