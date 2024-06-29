import  express  from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";
import productController from "../controller/productController.js";
import colorController from "../controller/colorController.js";
import uploadFields from "../config/multerConfig.js";

const router=express(); 



// for admin



router.post('/addProduct', authenticateAdmin,authorizeAdmin,(req, res) => {
  uploadFields(req, res, function(err) {
      if(err){
        return res.status(400).json({ msg: err });
      }
      productController.createProduct(req, res);
    });
  });


  router.put('/updateProduct/:id', authenticateAdmin, authorizeAdmin, (req, res) => {
    uploadFields(req, res, function(err) {
      if (err) {
        return res.status(400).json({ msg: err });
      }
      productController.updateProduct(req, res);
    });
  });





router.delete('/deleteProduct/:id',authenticateAdmin, authorizeAdmin,productController.deleteProduct);
router.put('/publishProduct/:id', authenticateAdmin,authorizeAdmin,productController.publishProduct);
router.get('/totalProductsCount',authenticateAdmin, authorizeAdmin,productController.totalProductsCount);

router.put('/unPublishProduct/:id',authenticateAdmin, authorizeAdmin,productController.unpublishProduct);
router.put('/enableQuickDeal/:id',authenticateAdmin, authorizeAdmin,productController.enableQuickDeal);
router.put('/disableQuickDeal/:id',authenticateAdmin, authorizeAdmin,productController.disableQuickDeal);
router.put('/disableRefund/:id',authenticateAdmin, authorizeAdmin,productController.disableRefund);
router.put('/enableRefund/:id',authenticateAdmin, authorizeAdmin,productController.enableRefund);



router.get('/getAllProducts_admin',authenticateAdmin, authorizeAdmin, productController.getAllProducts_admin);
router.get('/getProductByCategory_admin/:category',authenticateAdmin, authorizeAdmin,productController.getProductByCategory);
router.get('/getProductBySubCategory_admin/:subcategory',authenticateAdmin, authorizeAdmin,productController.getProductBySubCategory);
router.delete('/deleteCustomerReview/:id',authenticateAdmin, authorizeAdmin,productController.deleteCustomerReview);
router.post('/replyCustomerReview/:id',authenticateAdmin, authorizeAdmin,productController.replyCustomerReview);




//color
router.post('/addColor',authenticateAdmin, authorizeAdmin, colorController.addColor);
router.get('/fetchColors',authenticateAdmin, authorizeAdmin, colorController.getColors);
router.delete('/deleteColor/:id',authenticateAdmin, authorizeAdmin,colorController.deleteColor);






// for users

router.get('/searchProducts',authenticateUser, productController.searchProducts);
router.get('/getProductDetails/:id',authenticateUser, productController.getProductDetails);

router.get('/fetchNewProducts',authenticateUser,productController.fetchNewProducts);
router.get('/filterProducts',authenticateUser,productController.filterProducts);


router.get('/getProductByCategory/:category',authenticateUser, productController.getProductByCategory);
router.get('/getProductBySubCategory/:subcategory',authenticateUser, productController.getProductBySubCategory);
router.get('/getQuickDealProducts',authenticateUser, productController.getQuickDealProduct);

router.get('/getProductByColorVariant/:productId/colors/:colorId',authenticateUser,productController.getProductByColorVariant );


















export default router;