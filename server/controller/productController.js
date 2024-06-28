import Product from "../models/product.js";
import { Category } from "../models/category.js";
import { Subcategory } from "../models/category.js";
import Brand from "../models/brand.js";
import Color from "../models/color.js";
import upload from "../middlewares/multerMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// for admin 👇

// Create product



const createProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      category,
      subcategory,
      description,
      productFeatures,
      specialFeatures,
      careGuide,
      mrp,
      cashOnDelivery,
      refundable,
      published,
      featured,
      freeShipping,
      todaysDeal,
      productPrice,
      variations
    } = req.body;

    // Ensure brand exists
    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(400).json({ msg: 'Brand not found' });
    }

    // Extract thumbnail path
    const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;

    // Process variations and their photo paths
    let variationsArray = [];
    if (variations) {
      try {
        variationsArray = JSON.parse(variations).map((variation, index) => {
          const photoPath = req.files[`variations[${index}].photo`] ? req.files[`variations[${index}].photo`][0].path : null;
          return {
            ...variation,
            photo: photoPath
          };
        });
      } catch (err) {
        return res.status(400).json({ msg: 'Invalid variations format' }); 
      }
    }

    // Ensure colors exist for each variation
    for (let variation of variationsArray) {
      const colorExists = await Color.findById(variation.color);
      if (!colorExists) {
        return res.status(400).json({ msg: `Color not found for variation with label ${variation.label}` });
      }
    }

    // Create a new product
    const newProduct = new Product({
      productName,
      brand,
      category,
      subcategory,
      description,
      productFeatures,
      specialFeatures,
      careGuide,
      mrp,
      cashOnDelivery,
      refundable,
      published,
      featured,
      freeShipping,
      todaysDeal,
      productPrice,
      thumbnail,
      variations: variationsArray
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};














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

//search product by key word

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { keyword } = req.query;

    const query = {
      $or: [
        { productName: { $regex: keyword, $options: "i" } }, // Case-insensitive search
        { description: { $regex: keyword, $options: "i" } },
        { keywords: { $regex: keyword, $options: "i" } },
      ],
    };

    const products = await Product.find(query);

    res.json(products);
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

    res
      .status(200)
      .json({ message: "Product enabled in QuickD8eal successfully" });
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

    res
      .status(200)
      .json({ message: "Product disabled in QuickDeal successfully" });
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
      product.refund =
        req.body.refund !== undefined ? req.body.refund : product.refund;
      product.published =
        req.body.published !== undefined
          ? req.body.published
          : product.published;
      product.quickDeal =
        req.body.quickDeal !== undefined
          ? req.body.quickDeal
          : product.quickDeal;
      product.featured =
        req.body.featured !== undefined ? req.body.featured : product.featured;

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

//total products

const totalProductsCount = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});

    res.json(products.length);
  } catch (error) {
    console.error(error);
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

//disable refund

const disableRefund = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.refund = false;
    await product.save();

    res.status(200).json({ message: "Refund disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const enableRefund = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.refund = true;
    await product.save();

    res.status(200).json({ message: "Refund enabled successfully" });
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

    const products = await Product.find({
      category: category._id,
      published: true,
    })
      .sort({ featured: -1 })
      .populate("category")
      .populate("subcategory");

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json({ categoryName: category.name, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//get quickDeal product

const getQuickDealProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ quickDeal: true });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in quickdeal section" });
    }
    res.status(200).json({ quickDealProducts: products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

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

    const products = await Product.find({
      subcategory: subcategory._id,
      published: true,
    })
      .populate("category")
      .populate("subcategory");

    if (products.length === 0) {
      console.log("No published products found in this subcategory");
      return res
        .status(404)
        .json({ message: "No published products found in this subcategory" });
    }

    console.log(`Products found: ${products.length}`);
    products.forEach((product) =>
      console.log(`Product ID: ${product._id}, Name: ${product.productName}`)
    );

    res.status(200).json({ subcategoryName: subcategory.name, products });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(10);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { priceRange, size, color } = req.query;
    let filters = {};

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filters.sellingPrice = { $gte: minPrice, $lte: maxPrice };
    }

    if (size) {
      filters["variations.sizes.size"] = size;
    }

    if (color) {
      filters["variations.color"] = color;
    }

    const filteredProducts = await Product.find(filters);
    if (filteredProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the selected criteria" });
    } else {
      res.json(filteredProducts);
    }
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

//product detail view

const getProductDetails = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

//product variant selection(size,color)

//color

const getProductByColorVariant = asyncHandler(async (req, res) => {
  const { productId, colorId } = req.params;

  try {
    const product = await Product.findById(productId)
      .populate('category subcategory variations.color');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const colorVariant = product.variations.find(variation => variation.color._id.equals(colorId));

    if (!colorVariant) {
      return res.status(404).json({ message: 'Color variant not found for this product' });
    }

    const response = {
      productName: product.productName,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
      description: product.description,
      rating: product.rating,
      numReviews: product.numReviews,
      refund: product.refund,
      published: product.published,
      featured: product.featured,
      quickDeal: product.quickDeal,
      color: colorVariant.color,
      sizes: colorVariant.sizes.map(sizeVariant => ({
        size: sizeVariant.size,
        stock: sizeVariant.stock,
        images: sizeVariant.images,
        sellingPrice: product.sellingPrice, 
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', error });
  }
});












//product add to cart and wishlist





// product review and rating(last)












export default {
  createProduct,
  publishProduct,
  searchProducts,
  unpublishProduct,
  getAllProducts_admin,
  updateProduct,
  deleteProduct,
  deleteCustomerReview,
  replyCustomerReview,
  getProductByCategory,
  getProductBySubCategory,
  fetchNewProducts,
  enableQuickDeal,
  disableQuickDeal,
  getQuickDealProduct,
  disableRefund,
  enableRefund,
  totalProductsCount,
  filterProducts,
  getProductDetails,
  getProductByColorVariant,
};
