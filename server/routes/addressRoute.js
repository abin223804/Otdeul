import express  from 'express';
import {authenticate,authorizeAdmin} from '../middlewares/authMiddleware.js'
import addressController from '../controller/addressController.js';

const router=express();


//for user

router.post('/addAddress',authenticate,addressController.createAddress);
router.get('/getAllAddress',authenticate,addressController.getAllAddress);
router.get('/getSelectedAddress/:id',authenticate,addressController.getSelectedAddress);
router.put('/updateAddress/:id',authenticate,addressController.updateAddress);






export default router;