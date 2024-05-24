import  express  from "express";

import userController from '../controller/userController.js'

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";


const router=express();


router.post("/signUp",userController.createUser)
router.get("/authUser",authenticate)
router.get("/authUser",authorizeAdmin)
router.get("/allUsers",userController.getAllUsers)

router.post("/signIn",userController.loginUser)
router.post("/signOut",userController.logoutCurrentUser)

router.get("/getUserProfile",authenticate,userController.getCurrentUserProfile)
router.put("/updateCurrentUserProfile",authenticate,userController.updateCurrentUserProfile)

// ADMIN ROUTES 👇

router.delete("/deleteUser/:id",authenticate,userController.deleteUserById)







export default router