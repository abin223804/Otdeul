import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { uploadOptions } from "../controller/categoryController.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes
// router.post("/addCategory", categoryController.createCategory);
router.post('/addCategory', uploadOptions,categoryController.addCategory);













export default router;