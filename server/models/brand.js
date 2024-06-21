import mongoose from "mongoose";

const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});


const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;