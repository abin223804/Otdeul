import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { uploadOptions } from "../controller/categoryController.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes

router.post('/addCategory',authenticate, authorizeAdmin ,uploadOptions,categoryController.addCategory);
router.put('/updateCategory/:id',authenticate, authorizeAdmin , uploadOptions, categoryController.updateCategory);
router.delete('/deleteCategory/:id',authenticate, authorizeAdmin , categoryController.deleteCategory);
router.get('/listCategories', categoryController.listCategory);
router.get('/readCategory/:id', categoryController.readCategory);




//subcategory routes


router.post('/addSubcategory',uploadOptions,categoryController.addSubcategory);
router.put('/updateSubcategory/:id',uploadOptions,categoryController.updateSubcategory);
router.delete('/deleteSubcategory/:id',categoryController.deleteSubcategory);

















export default router;