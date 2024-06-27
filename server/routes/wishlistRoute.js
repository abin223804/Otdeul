import express from "express";
// import {, authorizeAdmin } from "../middlewares/authMiddleware.js";

import wishlistController from "../controller/wishlistController.js";

const router = express();

router.post('/addToWishList',wishlistController.addWishlist);
router.delete('/deleteFromWishList',wishlistController.removeFromWishlist);

router.get('/fetchWishList',wishlistController.getWishlist); 









export default router;
