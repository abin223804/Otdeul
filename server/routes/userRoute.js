import  express  from "express";

import userController from '../controller/userController.js'

const userRoute=express();


userRoute.post("/signUp",userController.createUser)
// userRoute.post("/signIn",userController.userSignIn)




export default userRoute