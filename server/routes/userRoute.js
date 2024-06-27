import  express  from "express";
import passport from 'passport';
import userController from '../controller/userController.js'

import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";



const router=express();



router.post("/sendOtp",userController.sendOtp)
router.post("/verifyOtp",userController.verifyOtp)
router.post("/signIn",userController.loginUser)
router.get("/getUserData",userController.getUserData)


router.post("/requestforgotPassword",userController.requestForgotPassword)
router.post("/confirmforgotPassword",userController.verifyOtpAndResetPassword);


router.post("/signOut",userController.logoutCurrentUser)
router.put("/resetPassword",authenticateUser,userController.resetPassword)






router.get("/allUsers",authenticateAdmin, authorizeAdmin,userController.getAllUsers) 



router.get("/getUserProfile",authenticateUser,userController.getCurrentUserProfile)
router.put("/updateCurrentUserProfile",authenticateUser,userController.updateCurrentUserProfile)


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

router.get("/admin", authenticateAdmin, authorizeAdmin ,userController.getAdminData)
router.delete("/deleteUser/:id", authenticateAdmin, authorizeAdmin ,userController.deleteUserById)
router.get("/getUser/:id", authenticateAdmin, authorizeAdmin ,userController.getUserById)
// router.put("/updateUser/:id",userController.updateUserById)
router.put("/blockUser/:id", authenticateAdmin, authorizeAdmin,userController.BlockUser)
router.put("/unBlockUser/:id", authenticateAdmin, authorizeAdmin,userController.unBlockUser)
router.get("/getUsersCount", authenticateAdmin, authorizeAdmin,userController.getUsersCount)













export default router