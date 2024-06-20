import {Cart} from "../models/cart.js";
import Product from "../models/product.js";
import CalculateItemsSalesTax from "../config/store.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addToCart = async (req, res) => {
    try {
      const user = req.user._id;
      const items = req.body.products;
  
      if (!items || items.length === 0) {
        return res.status(400).json({
          error: "No products provided."
        });
      }
  
      const taxRate = 8; // Example tax rate of 8% (should be fetched from a tax configuration)
  
      const products = CalculateItemsSalesTax(items, taxRate);
  
      // Example: save products to a cart or order
      const cart = new Cart({ user, products });
      await cart.save();
  
      // Simulate saving to database by logging
      console.log("Products with tax calculated:", products);
  
      res.status(200).json({
        success: true,
        products: products
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  

const deleteCart = asyncHandler(async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.Cart.cartId });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const updateCart = asyncHandler(async (req, res) => {
  try {
    const product = req.body.product;

    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $push: { products: product } }).exec();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});




const decreaseQuantity = async(products)=>{
    let bulkOptions = products.map(item => {
        return {
          updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity } }
          }
        };
      });
    
     await  Product.bulkWrite(bulkOptions);
    

}

const deleteProductFromCart = asyncHandler(async(req,res)=>{
    try {
        const product = {product: req.body.productId}

        const query ={_id:req.params.cartId}

        await Cart.updateOne(query,{$pull:{products:product}}).exec();


        res.status(200).json({
            success:true
        })
        
    } catch (error) {
        res.status(400).json({
            error: "Your request could not be processed. Please try again.",
        })
    }
})














export default {
  addToCart,
  deleteCart,
  deleteProductFromCart,
  updateCart,
  decreaseQuantity,
};
