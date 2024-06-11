import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },

  isDefault: {
    type: Boolean,
    required: true,
    default: false,
  },

  updated: Date,

  created: {
    type: Date,
    default: Date.now,
  },
});

const Address = mongoose.model("Address", AddressSchema);

export { Address };
