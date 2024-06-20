import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import cartController from "../controller/cartController.js";

const router = express();



router.post('/addToCart',authenticate,cartController.addToCart);
router.delete('/deleteCart/:cartId',authenticate,cartController.deleteCart);












export default router;
