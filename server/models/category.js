import mongoose from 'mongoose';

const { Schema } = mongoose;

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  banner: String,
  icon: String,  
  coverImage: String,
  parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  banner: String, 
  icon: String,   
  coverImage: String, 
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export { Category, Subcategory };
