


import mongoose from 'mongoose';

const variationSchema = new mongoose.Schema({
    color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', required: true },
    label: { type: String, required: true },
    size: { type: String, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    discountType: { type: String, enum: ['percentage', 'amount'], required: true },
    finalPrice: { type: Number, required: true },
    photo: { type: [String], default: [] } 
  });
  
  const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    description: { type: String, required: true },
    productFeatures: { type: String, required: true },
    specialFeatures: { type: String, required: true },
    careGuide: { type: String, required: true },
    mrp: { type: Number, required: true }, 
    cashOnDelivery: { type: Boolean, required: true },
    refundable: { type: Boolean, required: true },
    published: { type: Boolean, required: true },
    featured: { type: Boolean, required: true },
    freeShipping: { type: Boolean, required: true },
    todaysDeal: { type: Boolean, required: true },
    productPrice: { type: Number, required: true },
    thumbnail: { type: String }, 
    variations: [variationSchema]
  });
  
  const Product = mongoose.model('Product', productSchema);

export default Product;



