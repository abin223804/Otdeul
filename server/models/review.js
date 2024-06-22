import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },

  title: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
    trim: true,
  },
  isRecommended: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    default: "Waiting Approval",
    enum: ["Waiting Approval", "Approved", "Rejected"],
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

const review = mongoose.model("Review", reviewSchema);

export default review;
