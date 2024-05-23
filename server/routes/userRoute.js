import express from "express";
const userRoute=express();
import userController from '../controller/userController.js'

userRoute.post("/signup",userController.userSignUp)




export default userRoute()