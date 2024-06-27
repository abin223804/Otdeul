import express from "express";
import { authenticateUser, authenticateAdmin, authorizeAdmin } from "../middlewares/authMiddleware.js";

import addressController from "../controller/addressController.js";

const router = express();

//for user

router.post("/addAddress",authenticateUser,addressController.createAddress);
router.get("/getAllAddress",authenticateUser, addressController.getAllAddress);
router.get(
  "/getSelectedAddress/:id",authenticateUser,
 
  addressController.getSelectedAddress
);
router.put("/updateAddress/:id",authenticateUser, addressController.updateAddress);
router.delete(
  "/deleteAddress/:id",
 
  addressController.deleteAddress
);

export default router;
