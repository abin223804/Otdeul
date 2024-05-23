import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: "string", required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },

    role: { type: String },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const userModel = mongoose.model("user", userSchema);

// module.exports = userModel;
export default userModel
