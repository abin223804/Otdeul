
import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import reviewController from "../controller/reviewController.js";

const router = express();

router.post('/addReview',authenticate,reviewController.addReview);
router.get('/fetchAllReviews',authenticate,reviewController.fetChAllReviews);
router.put('/updateReview/:id',authenticate,reviewController.updateReview);


router.put('/approveReview/:reviewId',authenticate,authorizeAdmin,reviewController.approveReview);







export default router ;