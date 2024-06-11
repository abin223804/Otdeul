import { Address } from "../models/address.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createAddress = asyncHandler(async (req, res) => {
  try {
    const { address, city, state, country, zipCode, isDefault } = req.body;

    const newAddress = new Address({
      user: req.user._id,
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

    const userId = req.user._id;
    const allAddress = await Address.find({user:userId}).populate("user");

    res.status(200).json(allAddress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



const getSelectedAddress = asyncHandler(async (req, res) => {
  try {
    const address = await Address.findById(req.params.id).populate("user");

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



const updateAddress = asyncHandler(async(req,res)=>{

try {

    const updateAddress = await Address.findOneAndUpdate(

        {_id: req.params.id ,user: req.user._id},req.body,

        {new:true}
    );

    if (!updateAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(updateAddress);
  
    
} catch (error) {
    res.status(500).json({message: error.message});
}
})



const deleteAddress = asyncHandler(async(req,res)=>{


try {

    const deleteAddress = await Address.findOneAndDelete({_id: req.params.id})
    
if(!deleteAddress){

    return res.status(404).json({ message: "Address not found" });
}
res.status(200).json({message: "Address deleted successfully" });

} catch (error) {
    res.status(500).json({message: error.message});
}

})







export default {
  createAddress,
  getAllAddress,
  getSelectedAddress,
  updateAddress ,
  deleteAddress 
};
