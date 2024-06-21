import  express  from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";
import colorController from "../controller/colorController.js";


const router=express(); 



// for admin

router.post('/addProduct',authenticate, authorizeAdmin, productController.createProduct);

router.put('/updateProduct/:id',authenticate, authorizeAdmin,productController.updateProduct);
router.delete('/deleteProduct/:id',authenticate, authorizeAdmin,productController.deleteProduct);
router.put('/publishProduct/:id',authenticate, authorizeAdmin,productController.publishProduct);
router.get('/totalProductsCount',authenticate, authorizeAdmin,productController.totalProductsCount);

router.put('/unPublishProduct/:id',authenticate, authorizeAdmin,productController.unpublishProduct);
router.put('/enableQuickDeal/:id',authenticate, authorizeAdmin,productController.enableQuickDeal);
router.put('/disableQuickDeal/:id',authenticate, authorizeAdmin,productController.disableQuickDeal);
router.put('/disableRefund/:id',authenticate, authorizeAdmin,productController.disableRefund);
router.put('/enableRefund/:id',authenticate, authorizeAdmin,productController.enableRefund);



router.get('/getAllProducts_admin',authenticate, authorizeAdmin, productController.getAllProducts_admin);
router.get('/getProductByCategory_admin/:category',authenticate, authorizeAdmin,productController.getProductByCategory);
router.get('/getProductBySubCategory_admin/:subcategory',authenticate, authorizeAdmin,productController.getProductBySubCategory);
router.delete('/deleteCustomerReview/:id',authenticate, authorizeAdmin,productController.deleteCustomerReview);
router.post('/replyCustomerReview/:id',authenticate, authorizeAdmin,productController.replyCustomerReview);




//color
router.post('/addColor',authenticate, authorizeAdmin, colorController.addColor);
router.get('/fetchColors',authenticate, authorizeAdmin, colorController.getColors);
router.delete('/deleteColor/:id',authenticate, authorizeAdmin,colorController.deleteColor);








// for users

router.get('/searchProducts',authenticate, productController.searchProducts);
router.get('/getProductDetails/:id',authenticate, productController.getProductDetails);

router.get('/fetchNewProducts',authenticate,productController.fetchNewProducts);
router.get('/filterProducts',authenticate,productController.filterProducts);


router.get('/getProductByCategory/:category',authenticate, productController.getProductByCategory);
router.get('/getProductBySubCategory/:subcategory',authenticate, productController.getProductBySubCategory);
router.get('/getQuickDealProducts',authenticate, productController.getQuickDealProduct);

router.get('/getProductByColorVariant/:productId/colors/:colorId',authenticate,productController.getProductByColorVariant );


















export default router;