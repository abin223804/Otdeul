import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";
const router=express();



// for users






// for admin