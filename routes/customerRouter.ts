import express from "express";
import * as CustomerAuthController from "../controllers/customerauth.controller"
import {refreshToken} from "../controllers/util/token.controller";
import {authenticateUser, authorizeAdmin, authorizeCustomer} from "../middlewares/auth.middleware";


const router = express.Router();


router.post('/customerRegister',CustomerAuthController.registerCustomer);

// router.post("/customerLogin", CustomerAuthController.customerLogin);//this

router.post("/refresh-token",refreshToken);


router.get("/view",authenticateUser,authorizeAdmin,CustomerAuthController.getAllCustomer);
router.get("/:customerId",authenticateUser,CustomerAuthController.getCustomerById);
router.put("/:customerId",authenticateUser,CustomerAuthController.updateCustomer);
router.delete("/:customerId",authenticateUser,authorizeAdmin,CustomerAuthController.deleteCustomer);

export default router;