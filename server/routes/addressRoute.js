import express  from 'express';
import {authenticate,authorizeAdmin} from '../middlewares/authMiddleware.js'
import addressController from '../controller/addressController.js';

const router=express();


//for user

router.post('/addAddress',authenticate,addressController.createAddress);






export default router;