import express from "express"
import * as AuthController from "../controllers/util/auth.controller"


const router = express.Router();

router.post('/adminRegister',AuthController.registerAdmin);
router.post('/adminLogin',AuthController.adminLogin);
router.post("/refresh-token", AuthController.refreshToken);

export default router;