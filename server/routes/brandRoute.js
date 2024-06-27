import express from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";


import brandController from "../controller/brandController.js";

const router = express();

router.post('/addBrand', authenticateAdmin, authorizeAdmin,brandController.addBrand);  
router.get('/listBrand', authenticateAdmin, authorizeAdmin,brandController.listBrand);
router.delete('/deleteBrand/:id', authenticateAdmin, authorizeAdmin,brandController.deleteBrand);
router.put('/updateBrand/:id', authenticateAdmin, authorizeAdmin,brandController.updateBrand);
router.put('/updateActiveStatus/:id', authenticateAdmin, authorizeAdmin,brandController.toggleBrandActiveStatus);










export default router;
