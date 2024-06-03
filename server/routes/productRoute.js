import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";

const router=express();



// for admin


router.post('/addProduct',authenticate,authorizeAdmin, productController.createProduct);
router.put('/updateProduct/:id',authenticate,authorizeAdmin,productController.updateProduct);
router.delete('/deleteProduct/:id',authenticate,authorizeAdmin,productController.deleteProduct);
router.put('/publishProduct/:id',authenticate,authorizeAdmin,productController.publishProduct);
router.put('/unPublishProduct/:id',authenticate,authorizeAdmin,productController.unpublishProduct);
router.get('/getAllProducts_admin',authenticate,authorizeAdmin, productController.getAllProducts_admin);










// for users


// router.get("/getProducts", productController.getProducts);
// router.get("/getProduct/:id", productController.getProducts);
















export default router;