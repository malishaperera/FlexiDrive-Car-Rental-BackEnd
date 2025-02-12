import dotenv from "dotenv";
import {Request, Response} from "express";
import {bookingAll, createBooking, isBookingCredentials} from "../databse/booking-client";
import {isCustomerCredentials} from "../databse/customer-client";
import {isCarCredentials} from "../databse/car-client";
import {generateBookingId} from "./util/generateID.controller";
import Booking from "../models/Booking";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

dotenv.config();




// export const carBooking = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { carIds, customerId, startDate, endDate, location } = req.body;
//
//         if (!Array.isArray(carIds) || carIds.length === 0) {
//             return res.status(400).json({ message: 'Please provide a list of car IDs' });
//         }
//
//         const isCustomer = await isCustomerCredentials(customerId);
//         if (isCustomer == null) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }
//
//         // Convert startDate and endDate to Date objects if they are not already
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//
//         // Check if the dates are valid
//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//             return res.status(400).json({ message: 'Invalid date format' });
//         }
//
//         const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
//
//         // Start a database transaction to ensure atomicity
//         const transaction = await prisma.$transaction(async (prisma) => {
//             const bookingId = await generateBookingId();  // Only generate one bookingId
//
//             let totalAmount = 0;
//
//             // Create the booking entry (this will only happen once)
//             const booking = await prisma.booking.create({
//                 data: {
//                     bookingId,
//                     customerId,
//                     startDate: start,  // Use the Date object directly
//                     endDate: end,      // Use the Date object directly
//                     location,
//                     status: 'PENDING',
//                     totalAmount: 0, // Initially set to 0
//                 },
//             });
//
//             // Create relationships with cars and calculate the total amount
//             const carBookingPromises = carIds.map(async (carId) => {
//                 const isCar = await isCarCredentials(carId);
//                 if (isCar == null) {
//                     throw new Error(`Car with ID ${carId} not found`);
//                 }
//
//                 const carTotalAmount = rentalDays * Number(isCar.pricePerDay);
//                 totalAmount += carTotalAmount;
//
//                 // Create carBooking relation (this associates cars with the booking)
//                 await prisma.bookingCar.create({
//                     data: {
//                         bookingId,
//                         carId,
//                     },
//                 });
//             });
//
//             // Wait for all car bookings to be created
//             await Promise.all(carBookingPromises);
//
//             // Update totalAmount for the booking after all cars are linked
//             await prisma.booking.update({
//                 where: { bookingId },
//                 data: { totalAmount },
//             });
//
//             return booking;
//         });
//
//         return res.status(200).json({
//             message: 'Booking successfully created',
//             booking: transaction,
//             totalAmount: transaction.totalAmount,
//         });
//
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

export const carBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const { carIds, customerId, startDate, endDate, location } = req.body;

        if (!Array.isArray(carIds) || carIds.length === 0) {
            return res.status(400).json({ message: 'Please provide a list of car IDs' });
        }

        const isCustomer = await isCustomerCredentials(customerId);
        if (isCustomer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Call createBooking from booking-client.ts
        const booking = await createBooking(carIds, customerId, startDate, endDate, location);

        return res.status(200).json({
            message: 'Booking successfully created',
            booking,
            totalAmount: booking.totalAmount,
        });

    } catch (err) {
        console.error(err);
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