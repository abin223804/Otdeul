import express from "express";
// import {  authorizeAdmin } from "../middlewares/authMiddleware.js";

import cartController from "../controller/cartController.js";

const router = express();



router.post('/addToCart',cartController.addToCart);
router.delete('/deleteCart/:cartId',cartController.deleteCart);
router.post('/addProductToCart/:cartId',cartController.updateCart);
router.delete('/deleteProductFromCart/:cartId/:ProductId',cartController.deleteProductFromCart);














export default router;
