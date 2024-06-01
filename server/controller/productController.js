import Product from "../models/product.js"; // Assuming the file structure
import upload from "../middlewares/multerMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// for admin 👇



// Create product


const createProduct = asyncHandler(async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const basePath = `${req.protocol}://${req.get(
        "host"
      )}/public/uploads/product`;
      const productVariations = [];

      const variations = req.body.variations; // assuming variations is already parsed correctly

      for (let varIndex = 0; varIndex < variations.length; varIndex++) {
        const variationData = variations[varIndex];
        const sizes = [];

        for (
          let sizeIndex = 0;
          sizeIndex < variationData.sizes.length;
          sizeIndex++
        ) {
          const sizeData = variationData.sizes[sizeIndex];
          const fieldName = `variations[${varIndex}][sizes][${sizeIndex}][images]`;
          const images = (req.files || [])
            .filter((file) => file.fieldname === fieldName)
            .map((file) => basePath + "/" + file.filename);

          sizes.push({
            size: sizeData.size,
            stock: parseInt(sizeData.stock, 10),
            images: images,
          });
        }

        productVariations.push({
          color: variationData.color,
          sizes: sizes,
        });
      }

      const newProduct = new Product({
        productName: req.body.productName,
        variations: productVariations,
        category: req.body.category,
        subcategory: req.body.subcategory,
        description: req.body.description,
        rating: req.body.rating || 0,
        numReviews: req.body.numReviews || 0,
        refund: req.body.refund || true,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Read or view product(all)

// Read or view product(by id/category)

//update product

//Delete product

//manage customer review (delete/reply)






// for user 👇


//product browse by category

//product detail view

//product variant selection(size,color)

//product add to cart and wishlist

// product review and rating

//product comparison

//product recommendations












export default {
  createProduct,

};
