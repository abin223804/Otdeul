import  express  from "express";

import userController from '../controller/userController.js'

const userRoute=express();


userRoute.post("/signUp",userController.createUser)
userRoute.post("/signIn",userController.loginUser)
userRoute.post("/signOut",userController.logoutCurrentUser)





export default userRoute