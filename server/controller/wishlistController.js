import User from "../models/userModel.js";
import Product from "../models/product.js";
import mongoose from 'mongoose';
import asyncHandler from "../middlewares/asyncHandler.js";

const addWishlist = asyncHandler(async(req,res)=>{

    try {
        const userId = req.user.id;
        const { productId } = req.body;
    
        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found");
    
        const product = await Product.findById(productId);
        if (!product) return res.status(404).send("Product not found");
    
        if (user.wishlist.includes(productId)) {
          return res.status(400).send("Product already in wishlist");
        }
    
        user.wishlist.push(productId);
        await user.save();
    
        res.status(200).json({
            success: true,
            message:
              "Your Product has been added successfully to the wishlist",
            id: user.wishlist,
          });

        
    } catch (error) {
        console.error(error);
    res.status(500).send("An error occurred");
    }
})

const removeFromWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID");
    }
  
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");
  
    const productIndex = user.wishlist.findIndex(id => id.toString() === productId);
  
    console.log(productIndex);
  
    if (productIndex === -1) {
      return res.status(404).send("Product not found in wishlist");
    }
  
    user.wishlist.splice(productIndex, 1);
    await user.save();
  
    res.status(200).json({message:"Product removed from wishlist"});
  });



const getWishlist = asyncHandler(async(req,res)=>{
try {

    const userId = req.user.id;

    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).send("User not found");

    res.send(user.wishlist);


    
} catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
}

})






export default { addWishlist,removeFromWishlist,getWishlist}