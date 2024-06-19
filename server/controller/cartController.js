import Cart from "../models/cart.js";
import Product from "../models/product.js";
import caculateItemsSalesTax from "../config/store.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const items = req.body.products;

    const products = caculateItemsSalesTax(items);

    const cart = new Cart({
      user,
      products,
    });

    const cartDoc = await cart.save();

    decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: cartDoc.id,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const deleteCart = asyncHandler(async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.Cart.id });
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




const decreaseQuantity = asyncHandler(async(products)=>{
    let bulkOptions = products.map(item => {
        return {
          updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity } }
          }
        };
      });
    
      Product.bulkWrite(bulkOptions);
    

})

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
