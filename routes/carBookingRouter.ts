import express from "express"
import {authenticateUser, authorizeAdmin} from "../middlewares/auth.middleware";
import * as BookingController from "../controllers/booking.controller"
import {carBookingUpdate} from "../controllers/booking.controller";



const router = express.Router();


router.post("/carBooking", authenticateUser, authorizeAdmin, BookingController.carBooking)

router.get("/", authenticateUser,authorizeAdmin, BookingController.getAllBookings);
router.get("/:id", authenticateUser,authorizeAdmin, BookingController.getBookingById);
router.put("/:id", authenticateUser,authorizeAdmin, BookingController.carBookingUpdate);



export default router;