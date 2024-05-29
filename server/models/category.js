import mongoose from 'mongoose';

const { Schema } = mongoose;

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  banner: String, // URL to the banner image
  icon: String,   // URL to the icon image
  coverImage: String, // URL to the cover image
  parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  banner: String, // URL to the banner image
  icon: String,   // URL to the icon image
  coverImage: String, // URL to the cover image
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export { Category, Subcategory };
