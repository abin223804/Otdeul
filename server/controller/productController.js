import Product from '../models/product'; // Assuming the file structure

// Controller function to create a new product
const createProduct = async (req, res) => {
  try {
    const { name, image, quantity, category, subcategory, description, price, countInStock } = req.body;
    const product = await Product.create({
      name,
      image,
      quantity,
      category,
      subcategory,
      description,
      price,
      countInStock,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category subcategory');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category subcategory');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, quantity, category, subcategory, description, price, countInStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { name, image, quantity, category, subcategory, description, price, countInStock },
      { new: true }
    ).populate('category subcategory');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all reviews of a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const reviews = product.reviews;
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to create a review for a product
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rating, comment } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      name,
      rating,
      comment,
      user: req.user._id, // Assuming you have authentication middleware that sets req.user
    };

    product.reviews.push(review);
    product.numReviews += 1;
    product.rating =
      (product.rating * (product.numReviews - 1) + rating) / product.numReviews;

    await product.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to update a review of a product
const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.find((r) => r._id.toString() === reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is authorized to update the review (optional)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this review' });
    }

    // Update the review fields
    review.rating = rating;
    review.comment = comment;

    // Recalculate the product rating
    product.rating =
      (product.reviews.reduce((acc, item) => item.rating + acc, 0)) /
      product.reviews.length;

    await product.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a review of a product
const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = product.reviews.find((r) => r._id.toString() === reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user is authorized to delete the review (optional)
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    product.reviews.pull(review);
    product.numReviews -= 1;

    if (product.numReviews === 0) {
      product.rating = 0;
    } else {
      product.rating =
        (product.rating * (product.numReviews + 1) - review.rating) / product.numReviews;
    }

    await product.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
