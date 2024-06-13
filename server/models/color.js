import mongoose from 'mongoose';

const { Schema } = mongoose;

const colorSchema = new Schema({
  colorName: { type: String, required: true },
  colorCode: { type: String, required: true },
}, { timestamps: true });

const Color = mongoose.model('Color', colorSchema);

export default Color;
