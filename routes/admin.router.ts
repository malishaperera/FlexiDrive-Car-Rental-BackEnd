import express from "express"
import * as AdminController from "../controllers/admin.controller"
import {refreshToken} from "../controllers/util/token.controller";
import {deleteAdmin, getAdminById, updateAdmin} from "../controllers/admin.controller";
import {authenticateUser, authorizeAdmin} from "../middlewares/auth.middleware";


const router = express.Router();


router.post('/adminRegister',AdminController.registerAdmin);

router.get('/view',authenticateUser,authorizeAdmin,AdminController.getAllAdmin);
router.get('/:adminId',authenticateUser,authorizeAdmin,AdminController.getAdminById);
router.put('/:adminId',authenticateUser,authorizeAdmin,AdminController.updateAdmin);
router.delete('/:adminId',authenticateUser,authorizeAdmin,AdminController.deleteAdmin);



// router.post('/adminLogin',AuthController.adminLogin);//this

router.post("/refresh-token",refreshToken);


export default router;