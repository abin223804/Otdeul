import express from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

import cartController from "../controller/cartController.js";

const router = express();



router.post('/addToCart',authenticateUser,cartController.addToCart);
router.delete('/deleteCart/:cartId',authenticateUser,cartController.deleteCart);
router.post('/addProductToCart/:cartId',authenticateUser,cartController.updateCart);
router.delete('/deleteProductFromCart/:cartId/:ProductId',authenticateUser,cartController.deleteProductFromCart);














export default router;
