
import express from "express";

import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

import reviewController from "../controller/reviewController.js";

const router = express();

router.post('/addReview', authenticateUser,reviewController.addReview);
router.get('/fetchAllReviews', authenticateUser,reviewController.fetChAllReviews);
router.put('/updateReview/:id', authenticateUser,reviewController.updateReview);


router.put('/approveReview/:reviewId', authenticateAdmin, authorizeAdmin,reviewController.approveReview);







export default router ;