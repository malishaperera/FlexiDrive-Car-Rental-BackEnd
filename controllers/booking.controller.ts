import dotenv from "dotenv";
import {Request, Response} from "express";
import Booking from "../models/Booking";
import {isCarCredentials} from "../databse/car-client";
import {isCustomerCredentials} from "../databse/customer-client";
import {bookingAll, bookingCreate, isBookingCredentials} from "../databse/booking-client";
import {generateBookingId} from "./util/generateID.controller";

dotenv.config();


export const carBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const { carIds, customerId, startDate, endDate, location } = req.body;

        // Ensure carIds is an array with at least one car
        if (!Array.isArray(carIds) || carIds.length === 0) {
            return res.status(400).json({ message: 'Please provide a list of car IDs' });
        }

        // Check if customer exists
        const isCustomer = await isCustomerCredentials(customerId);
        if (isCustomer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Calculate rental days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        let bookings = [];
        let totalAmount = 0;

        // Loop through each carId and create bookings
        for (const carId of carIds) {
            const isCar = await isCarCredentials(carId);
            if (isCar == null) {
                return res.status(404).json({ message: `Car with ID ${carId} not found` });
            }

            // Calculate total amount for each car
            const carTotalAmount = rentalDays * Number(isCar.pricePerDay);
            totalAmount += carTotalAmount;

            // Generate a unique booking ID for each car booking
            const bookingId = await generateBookingId();

            // Create a booking entry for each car
            const booking: Booking = {
                bookingId,
                customerId,
                carId,
                startDate,
                endDate,
                location,
                status: 'PENDING',
                totalAmount: carTotalAmount,
            };

            // Save the booking
            const newBooking = await bookingCreate(booking);
            bookings.push(newBooking);
        }

        return res.status(200).json({
            message: 'Booking successfully',
            bookings: bookings,
            totalAmount,
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};





















export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
    try {




    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const getAllBookings = async (req: Request, res: Response): Promise<any> =>{
    try {
        const carBooking = await bookingAll();
        return res.status(200).json(carBooking);

    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const getBookingById = async (req: Request, res: Response): Promise<any> =>{
    const {bookingId} = req.params

    try {
        const carBooking = await isBookingCredentials(bookingId);
        if (carBooking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(carBooking);
    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}