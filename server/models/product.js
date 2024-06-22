import mongoose from "mongoose";

const { Schema } = mongoose;

const sizeSchema = new Schema({
  size: { type: String, required: false },
  stock: { type: Number, required: true },
  images: [{ type: String, required: true }],
});

const variationSchema = new Schema({
  color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  sizes: [sizeSchema],
});

const discountSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["fixed", "percentage"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    variations: [variationSchema],
    keywords: {
      type: ["String"],
      required: true,
    },
    mrp: { type: String, required: true },
    discount: discountSchema,
    minimumQuantity: {
      type: "Number",
      required: true,
    },
    sellingPrice: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    description: { type: String, required: true },
    refund: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    quickDeal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
