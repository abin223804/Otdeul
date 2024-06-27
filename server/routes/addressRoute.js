import express from "express";
// import { authorizeAdmin } from "../middlewares/authMiddleware.js";
import addressController from "../controller/addressController.js";

const router = express();

//for user

router.post("/addAddress", addressController.createAddress);
router.get("/getAllAddress", addressController.getAllAddress);
router.get(
  "/getSelectedAddress/:id",
 
  addressController.getSelectedAddress
);
router.put("/updateAddress/:id", addressController.updateAddress);
router.delete(
  "/deleteAddress/:id",
 
  addressController.deleteAddress
);

export default router;
