import Product from "../models/product.js"; 
import { Category } from "../models/category.js";
import { Subcategory } from "../models/category.js";// Assuming the file structure
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
        published: req.body.published || false,
        quickDeal:req.body.quickDeal || false,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//publish product

const publishProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.published = true;
    await product.save();

    res.status(200).json({ message: "Product published successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//Unpublish product

const unpublishProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.published = false;
    await product.save();

    res.status(200).json({ message: "Product unpublished successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


//enable product to  quick deal

const enableQuickDeal = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quickDeal = true;
    await product.save();

    res.status(200).json({ message: "Product enabled in Quickdeal successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});





//disable product to quick deal


const disableQuickDeal = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quickDeal = false;
    await product.save();

    res.status(200).json({ message: "Product disabled in QuickDeal successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});












// refund/replace/return(doubt)

// get or view products(all)

const getAllProducts_admin = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//update product

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const basePath = `${req.protocol}://${req.get(
        "host"
      )}/public/uploads/product`;
      const productVariations = [];

      const variations = req.body.variations;

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

      product.productName = req.body.productName || product.productName;
      product.variations =
        productVariations.length > 0 ? productVariations : product.variations;
      product.category = req.body.category || product.category;
      product.subcategory = req.body.subcategory || product.subcategory;
      product.description = req.body.description || product.description;
      product.rating =
        req.body.rating !== undefined ? req.body.rating : product.rating;
      product.numReviews =
        req.body.numReviews !== undefined
          ? req.body.numReviews
          : product.numReviews;
      product.refund =req.body.refund !== undefined ? req.body.refund : product.refund;
      product.published = req.body.published !== undefined ? req.body.published: product.published;
      product.quickDeal = req.body.quickDeal!== undefined ? req.body.quickDeal: product.quickDeal;

      await product.save();
      res.status(200).json(product);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//Delete product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//manage customer review (delete/reply)

//delete customer review

const deleteCustomerReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.remove();

    product.numReviews = product.reviews.length;
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//reply customer review

const replyCustomerReview = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.reply = req.body.reply;

    await product.save();

    res.status(200).json({ message: "Reply added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// for user 👇

//product browse by category  (only published)

const getProductByCategory = asyncHandler(async (req, res) => {
  try {
    const categoryName = req.params.category;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: category._id, published: true }).populate('category').populate('subcategory');

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.status(200).json({ categoryName: category.name, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




//get quickDeal product

const getQuickDealProduct = asyncHandler(async(req,res)=>{

 try {
  const products = await Product.find({quickDeal:true})

  if (products.length === 0) {
    return res.status(404).json({ message: "No products found in quickdeal section" });
  }
  res.status(200).json({ quickDealProducts: products });
  
 } catch (error) {
  res.status(500).json({ message: "Server error", error });
 }
})







//product browse by Subcategory



const getProductBySubCategory = asyncHandler(async (req, res) => {
  try {
    const subcategoryName = req.params.subcategory;
    console.log(`Subcategory name received: ${subcategoryName}`);

    const subcategory = await Subcategory.findOne({ name: subcategoryName });

    if (!subcategory) {
      console.log("Subcategory not found");
      return res.status(404).json({ message: "Subcategory not found" });
    }

    console.log(`Subcategory found: ${subcategory}`);

    const products = await Product.find({ subcategory: subcategory._id, published: true })
                                  .populate('category')
                                  .populate('subcategory');

    if (products.length === 0) {
      console.log("No published products found in this subcategory");
      return res.status(404).json({ message: "No published products found in this subcategory" });
    }

    console.log(`Products found: ${products.length}`);
    products.forEach(product => console.log(`Product ID: ${product._id}, Name: ${product.productName}`));

    res.status(200).json({ subcategoryName: subcategory.name, products });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});









//product detail view

//product variant selection(size,color)

//product add to cart and wishlist

// product review and rating(last)

//product comparison

//product recommendations




export default {
  createProduct,
  publishProduct,
  unpublishProduct,
  getAllProducts_admin,
  updateProduct,
  deleteProduct,
  deleteCustomerReview,
  replyCustomerReview,
  getProductByCategory,
  getProductBySubCategory,
  enableQuickDeal ,
  disableQuickDeal,
  getQuickDealProduct ,

};
