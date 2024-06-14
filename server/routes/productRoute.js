import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";

const router=express(); 



// for admin

router.post('/addProduct',authenticate, authorizeAdmin, productController.createProduct);
router.post('/addColor',authenticate, authorizeAdmin, productController.addColor);

router.put('/updateProduct/:id',authenticate, authorizeAdmin,productController.updateProduct);
router.delete('/deleteProduct/:id',authenticate, authorizeAdmin,productController.deleteProduct);
router.put('/publishProduct/:id',authenticate, authorizeAdmin,productController.publishProduct);
router.get('/totalProductsCount',authenticate, authorizeAdmin,productController.totalProductsCount);

router.put('/unPublishProduct/:id',authenticate, authorizeAdmin,productController.unpublishProduct);
router.put('/enableQuickDeal/:id',authenticate, authorizeAdmin,productController.enableQuickDeal);
router.put('/disableQuickDeal/:id',authenticate, authorizeAdmin,productController.disableQuickDeal);
router.put('/disableRefund/:id',authenticate, authorizeAdmin,productController.disableRefund);
router.put('/enableRefund/:id',authenticate, authorizeAdmin,productController.enableRefund);



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