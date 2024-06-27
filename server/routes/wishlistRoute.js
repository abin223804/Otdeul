import express from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

import wishlistController from "../controller/wishlistController.js";

const router = express();

router.post('/addToWishList',authenticateUser,wishlistController.addWishlist);
router.delete('/deleteFromWishList',authenticateUser,wishlistController.removeFromWishlist);

router.get('/fetchWishList',authenticateUser,wishlistController.getWishlist); 









export default router;
