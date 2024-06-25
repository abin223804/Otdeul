import mongoose from "mongoose";

const { Schema } = mongoose;

const WishlistSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const wishlist = mongoose.model("wishlist", WishlistSchema);

export default wishlist;
