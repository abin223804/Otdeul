// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const sizeSchema = new Schema({
//   size: { type: String, required: false },
//   stock: { type: Number, required: true },
//   images: [{ type: String, required: true }],
// });

// const variationSchema = new Schema({
//   color: { type: Schema.Types.ObjectId, ref: "Color", required: true },
//   sizes: [sizeSchema],
// });

// const discountSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["fixed", "percentage"],
//     required: true,
//   },
//   value: {
//     type: Number,
//     required: true,
//   },
// });

// const productSchema = new Schema(
//   {
//     productName: { type: String, required: true },
//     brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
//     variations: [variationSchema],
//     keywords: {
//       type: ["String"],
//       required: true,
//     },
//     mrp: { type: String, required: true },
//     discount: discountSchema,
//     minimumQuantity: {
//       type: "Number",
//       required: true,
//     },
//     sellingPrice: { type: String, required: true },
//     category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
//     subcategory: {
//       type: Schema.Types.ObjectId,
//       ref: "Subcategory",
//       required: true,
//     },
//     description: { type: String, required: true },
//     refund: { type: Boolean, default: true },
//     published: { type: Boolean, default: false },
//     featured: { type: Boolean, default: false },
//     quickDeal: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model("Product", productSchema);

// export default Product;


import mongoose from 'mongoose';

const variationSchema = new mongoose.Schema({
    color: { type: String, required: true },
    label: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    discountType: { type: String, enum: ['percentage', 'amount'], required: true },
    finalPrice: { type: Number, required: true },
    photo: { type: String, default: null } 
});

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    productFeatures: { type: String, required: true },
    specialFeatures: { type: String, required: true },
    careGuide: { type: String, required: true },
    cashOnDelivery: { type: Boolean, required: true },
    refundable: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    featured: { type: Boolean, required: true },
    freeShipping: { type: Boolean, required: true },
    todaysDeal: { type: Boolean, required: true },
    productPrice: { type: Number, required: true },
    thumbnails: { type: [String], required: true }, 
    variations: [variationSchema] 
});

const Product = mongoose.model('Product', productSchema);

export default Product;



