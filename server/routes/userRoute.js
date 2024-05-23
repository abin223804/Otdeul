import  express  from "express";

import userController from '../controller/userController.js'

const userRoute=express();


userRoute.post("/signup",userController.userSignUp)



export default userRoute