import Review from "../models/review.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addReview = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    const review = new Review({
      ...req.body,
      user: user._id,
    });

    const reviewDoc = await review.save();

    res.status(200).json({
      success: true,
      message:
        "Your review has been added successfully and will appear when approved!",
      review: reviewDoc,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const fetChAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({isActive: true})
    .sort("-created")
    .populate({
      path: "user",
      select: "username email",
    })
    .populate({
      path: "product",
      select: "productName brand sellingPrice", 
    });

  const count = await Review.countDocuments();

  res.status(200).json({
    reviews,
    count,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  try {
    const reviewId = req.params.id;
    const update = req.body;
    const query = { _id: reviewId };

   const updated = await Review.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
       
      success: true,
      message: "Review updated successfully",
      updated
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});


const approveReview = asyncHandler(async(req, res)=>{
    try {
        const reviewId = req.params.reviewId;

        const query = { _id: reviewId };

        const update = {
            status: "approved",
            isActive: true,
        };

        await Review.findOneAndUpdate(query, update ,{
            new: true,
        });
        
        res.status(200).json({
            success:true,
        })

        
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
          });
    }
})




export default { addReview, fetChAllReviews, updateReview ,approveReview };
