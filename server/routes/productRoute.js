import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";

const router=express();



// for admin

router.post('/addProduct', productController.createProduct);
router.put('/updateProduct/:id',productController.updateProduct);
router.delete('/deleteProduct/:id',productController.deleteProduct);
router.put('/publishProduct/:id',productController.publishProduct);
router.put('/unPublishProduct/:id',productController.unpublishProduct);
router.put('/enableQuickDeal/:id',productController.enableQuickDeal);
router.put('/disableQuickDeal/:id',productController.disableQuickDeal);
router.put('/disableRefund/:id',productController.disableRefund);
router.put('/enableRefund/:id',productController.enableRefund);



router.get('/getAllProducts_admin', productController.getAllProducts_admin);
router.get('/getProductByCategory_admin/:category',productController.getProductByCategory);
router.get('/getProductBySubCategory_admin/:subcategory',productController.getProductBySubCategory);
router.delete('/deleteCustomerReview/:id',productController.deleteCustomerReview);
router.post('/replyCustomerReview/:id',productController.replyCustomerReview);




// for users


router.get('/getProductByCategory/:category',productController.getProductByCategory);
router.get('/getProductBySubCategory/:subcategory',productController.getProductBySubCategory);
router.get('/getQuickDealProducts',productController.getQuickDealProduct);

//get products for quick deal

















export default router;