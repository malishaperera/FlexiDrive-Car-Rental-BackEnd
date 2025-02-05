import express from "express"
import * as AuthController from "../controllers/util/auth.controller"
import {refreshToken} from "../controllers/util/token.controller";


const router = express.Router();

router.post('/adminRegister',AuthController.registerAdmin);
router.post('/adminLogin',AuthController.adminLogin);
router.post("/refresh-token",refreshToken);
// router.post("/refresh-token", AuthController.refreshToken);

export default router;