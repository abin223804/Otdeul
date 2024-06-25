import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import wishlistController from "../controller/wishlistController.js";

const router = express();

router.post('/addToWishList',authenticate,wishlistController.addWishlist);
router.delete('/deleteFromWishList',authenticate,wishlistController.removeFromWishlist);

router.get('/fetchWishList',authenticate,wishlistController.getWishlist); 









export default router;
