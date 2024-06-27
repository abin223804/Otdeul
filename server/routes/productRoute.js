import  express  from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";
import colorController from "../controller/colorController.js";


const router=express(); 



// for admin



router.post('/addProduct', (req, res) => {
    upload(req, res, function(err) {
      if(err){
        return res.status(400).json({ msg: err });
      }
      productController.createProduct(req, res);
    });
  });

// router.post('/addProduct', authorizeAdmin, productController.createProduct);

router.put('/updateProduct/:id', authorizeAdmin,productController.updateProduct);
router.delete('/deleteProduct/:id', authorizeAdmin,productController.deleteProduct);
router.put('/publishProduct/:id', authorizeAdmin,productController.publishProduct);
router.get('/totalProductsCount', authorizeAdmin,productController.totalProductsCount);

router.put('/unPublishProduct/:id', authorizeAdmin,productController.unpublishProduct);
router.put('/enableQuickDeal/:id', authorizeAdmin,productController.enableQuickDeal);
router.put('/disableQuickDeal/:id', authorizeAdmin,productController.disableQuickDeal);
router.put('/disableRefund/:id', authorizeAdmin,productController.disableRefund);
router.put('/enableRefund/:id', authorizeAdmin,productController.enableRefund);



router.get('/getAllProducts_admin', authorizeAdmin, productController.getAllProducts_admin);
router.get('/getProductByCategory_admin/:category', authorizeAdmin,productController.getProductByCategory);
router.get('/getProductBySubCategory_admin/:subcategory', authorizeAdmin,productController.getProductBySubCategory);
router.delete('/deleteCustomerReview/:id', authorizeAdmin,productController.deleteCustomerReview);
router.post('/replyCustomerReview/:id', authorizeAdmin,productController.replyCustomerReview);




//color
router.post('/addColor',authenticateAdmin, authorizeAdmin, colorController.addColor);
router.get('/fetchColors', authorizeAdmin, colorController.getColors);
router.delete('/deleteColor/:id', authorizeAdmin,colorController.deleteColor);






// for users

router.get('/searchProducts', productController.searchProducts);
router.get('/getProductDetails/:id', productController.getProductDetails);

router.get('/fetchNewProducts',productController.fetchNewProducts);
router.get('/filterProducts',productController.filterProducts);


router.get('/getProductByCategory/:category', productController.getProductByCategory);
router.get('/getProductBySubCategory/:subcategory', productController.getProductBySubCategory);
router.get('/getQuickDealProducts', productController.getQuickDealProduct);

router.get('/getProductByColorVariant/:productId/colors/:colorId',productController.getProductByColorVariant );


















export default router;