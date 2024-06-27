import express from "express";
// import {, authorizeAdmin } from "../middlewares/authMiddleware.js";

import brandController from "../controller/brandController.js";

const router = express();

router.post('/addBrand',brandController.addBrand);
router.get('/listBrand',brandController.listBrand);
router.delete('/deleteBrand/:id',brandController.deleteBrand);
router.put('/updateBrand/:id',brandController.updateBrand);
router.put('/updateActiveStatus/:id',brandController.toggleBrandActiveStatus);










export default router;
