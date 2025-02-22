import express from "express"
import * as AdminController from "../controllers/admin.controller"
import {refreshToken} from "../controllers/util/token.controller";


const router = express.Router();


router.post('/adminRegister',AdminController.registerAdmin);

// router.post('/adminLogin',AuthController.adminLogin);//this

router.post("/refresh-token",refreshToken);


export default router;