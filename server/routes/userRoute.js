import  express  from "express";

import userController from '../controller/userController.js'

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router=express();



router.post("/sendOtp",userController.sendOtp)
router.post("/verifyOtp",userController.verifyOtp)



router.get("/authUser",authenticate)
router.get("/authUser",authorizeAdmin)
router.get("/allUsers",userController.getAllUsers)

router.post("/signIn",userController.loginUser)
router.post("/signOut",userController.logoutCurrentUser)

router.get("/getUserProfile",authenticate,userController.getCurrentUserProfile)
router.put("/updateCurrentUserProfile",authenticate,userController.updateCurrentUserProfile)




// ADMIN ROUTES 👇

router.delete("/deleteUser/:id",authenticate,userController.deleteUserById)
router.get("/getUser/:id",authenticate,userController.getUserById)
router.put("/updateUser/:id",authenticate,userController.updateUserById)









export default router