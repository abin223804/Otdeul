import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes
router.post("/addCategory", categoryController.createCategory);












export default router;