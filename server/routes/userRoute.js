import  express  from "express";
import passport from 'passport';
import userController from '../controller/userController.js'

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router=express();



router.post("/sendOtp",userController.sendOtp)
router.post("/verifyOtp",userController.verifyOtp)
router.post("/signIn",userController.loginUser)

router.post("/requestforgotPassword",userController.requestForgotPassword)
router.post("/confirmforgotPassword",userController.verifyOtpAndResetPassword);


router.post("/signOut",userController.logoutCurrentUser)
router.put("/resetPassword", authenticate,userController.resetPassword)

router.get("/authUser",authenticate)
router.get("/authUser",authorizeAdmin)
router.get("/allUsers",userController.getAllUsers) 



router.get("/getUserProfile",authenticate,userController.getCurrentUserProfile)
router.put("/updateCurrentUserProfile",authenticate,userController.updateCurrentUserProfile)


// Google Auth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Facebook Auth Routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });










// ADMIN ROUTES 👇

router.post("/admin/signIn",userController.loginAdmin)

router.get("/admin",authenticate,authorizeAdmin,userController.getAdminData)
router.delete("/deleteUser/:id",authenticate,authorizeAdmin ,userController.deleteUserById)
router.get("/getUser/:id",authenticate,authorizeAdmin ,userController.getUserById)
router.put("/updateUser/:id",authenticate,authorizeAdmin ,userController.updateUserById)
router.put("/blockUser/:id",authenticate,authorizeAdmin ,userController.BlockUser)
router.put("/unBlockUser/:id",authenticate,authorizeAdmin ,userController.unBlockUser)
router.get("/getUsersCount",authenticate,authorizeAdmin ,userController.getUsersCount)













export default router