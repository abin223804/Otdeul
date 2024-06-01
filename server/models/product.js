import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
    {
      productName: { type: String, required: true },
      images: [{ type: String, required: true }], 
      category: { type: ObjectId, ref: "Category" }, // Optional category reference
      subcategory: { type: ObjectId, ref: "Subcategory" }, // Optional subcategory reference
      description: { type: String, required: true },
      reviews: [reviewSchema],
      rating: { type: Number, required: true, default: 0 },
      numReviews: { type: Number, required: true, default: 0 },
      dummyPrice: { type: Number, required: true, default: 0 },
      offerPercentage: { type: Number, required: true,
      price: { type: Number, required: true, default: 0 },
      Stock: { type: Number, required: true, default: 0 },
      color: { type: String, required: true },
      size: { type: String, required: true },
      refund: { type: Boolean, default:true},

    },
  },
    { timestamps: true }
  );
  
  

const Product = mongoose.model("Product", productSchema);
export default Product;
