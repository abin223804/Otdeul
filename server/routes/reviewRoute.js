
import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import reviewController from "../controller/reviewController.js";

const router = express();

router.post('/addReview',authenticate,authorizeAdmin,reviewController.addReview);
router.get('/fetchAllReviews',authenticate,authorizeAdmin,reviewController.fetChAllReviews);


export default router ;