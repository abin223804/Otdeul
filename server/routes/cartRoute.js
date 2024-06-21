import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import cartController from "../controller/cartController.js";

const router = express();



router.post('/addToCart',authenticate,cartController.addToCart);
router.delete('/deleteCart/:cartId',authenticate,cartController.deleteCart);
router.post('/addProductToCart/:cartId',authenticate,cartController.updateCart);
router.delete('/deleteProductFromCart/:cartId/:ProductId',authenticate,cartController.deleteProductFromCart);














export default router;
