import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";

const router=express();



// for admin


router.post('/addProduct',authenticate,authorizeAdmin, productController.createProduct);








// for users
// router.get("/getProducts", productController.getProducts);
// router.get("/getProduct/:id", productController.getProducts);
















export default router;