import { Address } from "../models/address";
import asyncHandler from "../middlewares/asyncHandler";

const createAddress = asyncHandler(async (req, res) => {
  try {
    const newAddress = new Address(req.body);

    const savedAddress = await newAddress.save();

    res.status(201).json(savedAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




const getAllAddress = asyncHandler(async (req, res) => {
  try {
    const addAddress = await Address.find().populate("user");

    res.status(200).json(addAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});






export default {
  createAddress,
  getAllAddress,
};
