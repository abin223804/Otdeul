import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { uploadOptions } from "../controller/categoryController.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes

router.post('/addCategory', uploadOptions,categoryController.addCategory);
router.put('/updateCategory/:id', uploadOptions, categoryController.updateCategory);














export default router;