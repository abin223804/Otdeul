import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: { type: String, required: false },
  image: { type: String, required: false },
  rating: { type: Number, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User" }, // Assuming 'User' is the referenced model
});

const sizeSchema = new Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String, required: true }],
});

const variationSchema = new Schema({
  color: { type: String, required: false },
  sizes: [sizeSchema],
});

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    variations: [variationSchema],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    refund: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
