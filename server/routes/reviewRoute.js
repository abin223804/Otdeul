
import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import reviewController from "../controller/reviewController.js";

const router = express();

router.post('/addReview',authenticate,authorizeAdmin,reviewController.addReview);


export default router ;