import  express  from "express";
// import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { uploadOptions } from "../controller/categoryController.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes 👇


// for admin// for admin


router.post('/addCategory' ,uploadOptions,categoryController.addCategory);
router.put('/updateCategory/:id' , uploadOptions, categoryController.updateCategory);
router.delete('/deleteCategory/:id' , categoryController.deleteCategory);
router.get('/countCategories' , categoryController.categoryCount);


// for user

router.get('/listCategories', categoryController.listCategory);
router.get('/readCategory/:id', categoryController.readCategory);




//subcategory routes 👇


// for admin

// router.post('/addSubcategory' ,uploadOptions,categoryController.addSubcategory);
router.put('/updateSubcategory/:id' ,uploadOptions,categoryController.updateSubcategory);
router.delete('/deleteSubcategory/:id' ,categoryController.deleteSubcategory);



// for user

router.get('/listSubCategories/:id', categoryController.listSubcategory);
router.get('/readSubCategory/:id', categoryController.readSubCategory);


















export default router;