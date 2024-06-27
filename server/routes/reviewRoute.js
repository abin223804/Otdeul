
import express from "express";
// import {  authorizeAdmin } from "../middlewares/authMiddleware.js";

import reviewController from "../controller/reviewController.js";

const router = express();

router.post('/addReview',reviewController.addReview);
router.get('/fetchAllReviews',reviewController.fetChAllReviews);
router.put('/updateReview/:id',reviewController.updateReview);


router.put('/approveReview/:reviewId',reviewController.approveReview);







export default router ;