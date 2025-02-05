import express from "express";
import * as CustomerAuthController from "../controllers/customerauth.controller"


const router = express.Router();


router.post('/customerRegister',CustomerAuthController.registerCustomer);
router.post("/customerLogin", CustomerAuthController.customerLogin);
router.post("/refresh-token", CustomerAuthController.refreshToken);


export default router;