import  express  from "express";

import userController from '../controller/userController.js'

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router=express();



router.post("/sendOtp",userController.sendOtp)
router.post("/verifyOtp",userController.verifyOtp)
router.post("/signIn",userController.loginUser)

router.post("/requestforgotPassword",userController.requestforgotPassword)
router.post("/confirmforgotPassword",userController.verifyOtpAndSetNewPassword);


router.post("/signOut",userController.logoutCurrentUser)
router.put("/resetPassword", authenticate,userController.resetPassword)

router.get("/authUser",authenticate)
router.get("/authUser",authorizeAdmin)
router.get("/allUsers",userController.getAllUsers)



router.get("/getUserProfile",authenticate,userController.getCurrentUserProfile)
router.put("/updateCurrentUserProfile",authenticate,userController.updateCurrentUserProfile)




// ADMIN ROUTES 👇



router.delete("/deleteUser/:id",authenticate,userController.deleteUserById)
router.get("/getUser/:id",authenticate,userController.getUserById)
router.put("/updateUser/:id",authenticate,userController.updateUserById)
router.put("/blockUser/:id",authenticate,userController.BlockUser)
router.put("/unBlockUser/:id",authenticate,userController.unBlockUser)
router.get("/getUsersCount",authenticate,userController.getUsersCount)













export default router