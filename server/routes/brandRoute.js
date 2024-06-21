import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

import brandController from "../controller/brandController.js";

const router = express();

router.post('/addBrand',authenticate,authorizeAdmin,brandController.addBrand);
router.get('/listBrand',authenticate,authorizeAdmin,brandController.listBrand);
router.delete('/deleteBrand/:id',authenticate,authorizeAdmin,brandController.deleteBrand);
router.put('/updateBrand/:id',authenticate,authorizeAdmin,brandController.updateBrand);
router.put('/updateActiveStatus/:id',authenticate,authorizeAdmin,brandController.toggleBrandActiveStatus);










export default router;
