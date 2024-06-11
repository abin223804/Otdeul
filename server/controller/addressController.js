import { Address } from "../models/address";
import asyncHandler from "../middlewares/asyncHandler";

const createAddress = asyncHandler(async (req, res) => {
  try {

const {address,city,state,country,zipCode,isDefault } = req.body

    const newAddress = new Address({

user:req.user._id,
address,
city,
state,
country,
zipCode,
isDefault,
    });

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


const getSelectedAddress = asyncHandler(async(req, res) => {

    try {
        const address = await Address.findById(req.params.id).populate("user");

        if(!address){
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json(address);
        
    } catch (error) {
        res.status(500).json({ message:error.message });
    }
})









export default {
  createAddress,
  getAllAddress,
  getSelectedAddress,


};
