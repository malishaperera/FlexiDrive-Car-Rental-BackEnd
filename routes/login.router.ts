import express from "express";
import * as AuthController from "../controllers/admin.controller";
import {userLogin} from "../controllers/util/userLogin.controller";
import * as UserLoginController from "../controllers/util/userLogin.controller"


const router = express.Router();

router.post('/userLogin',UserLoginController.userLogin);

export default router;