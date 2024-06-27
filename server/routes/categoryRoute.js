import  express  from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { uploadOptions } from "../controller/categoryController.js";
import categoryController from "../controller/categoryController.js";
const router=express();



// Category routes 👇


// for admin// for admin


router.post('/addCategory' , authenticateAdmin, authorizeAdmin ,uploadOptions,categoryController.addCategory);
router.put('/updateCategory/:id', authenticateAdmin, authorizeAdmin , uploadOptions, categoryController.updateCategory);
router.delete('/deleteCategory/:id' , authenticateAdmin, authorizeAdmin, categoryController.deleteCategory);
router.get('/countCategories', authenticateAdmin, authorizeAdmin , categoryController.categoryCount);


// for user

router.get('/listCategories', categoryController.listCategory);
router.get('/readCategory/:id',categoryController.readCategory);




//subcategory routes 👇


// for admin

// router.post('/addSubcategory' ,uploadOptions,categoryController.addSubcategory);
router.put('/updateSubcategory/:id', authenticateAdmin, authorizeAdmin ,uploadOptions,categoryController.updateSubcategory);
router.delete('/deleteSubcategory/:id', authenticateAdmin, authorizeAdmin ,categoryController.deleteSubcategory);



// for user

router.get('/listSubCategories/:id',categoryController.listSubcategory);
router.get('/readSubCategory/:id',categoryController.readSubCategory);


















export default router;