import express from "express"
import * as CarController from "../controllers/car.controller"
import {authenticateUser, authorizeAdmin, authorizeCustomer} from "../middlewares/auth.middleware";

const router = express.Router()

router.post("/carRegister", authenticateUser, authorizeAdmin, CarController.registerCar)
router.get("/", authenticateUser, CarController.getAllCars)
router.get("/available", authenticateUser, CarController.getAvailableCar)
router.get("/:carId", authenticateUser, authorizeAdmin, CarController.getCarById)
router.put("/:carId", authenticateUser, authorizeAdmin, CarController.updateCar)
router.delete("/:carId", authenticateUser, authorizeAdmin, CarController.deleteCar)



export default router;