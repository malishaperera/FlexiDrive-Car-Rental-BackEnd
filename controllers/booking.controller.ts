import dotenv from "dotenv";
import { Request, Response } from "express";
import {bookingAll, bookingUpdate, createBooking, isBookingCredentials} from "../databse/booking-client";
import { isCustomerCredentials } from "../databse/customer-client";

dotenv.config();

export const carBooking = async (req: Request, res: Response): Promise<any> => {

    console.log(req.body);
    try {
        const { carId, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation } = req.body;
        console.log(carId+"sccscscs");

        if (!Array.isArray(carId) || carId.length === 0) {
            return res.status(400).json({ message: 'Please provide a list of car IDs' });
        }

        const isCustomer = await isCustomerCredentials(customerId);
        if (isCustomer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Booking create function call
        const booking = await createBooking(carId, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation);

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

export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("mekedabn")
        const carBooking = await bookingAll();
        return res.status(200).json(carBooking);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<any> => {
    const { bookingId } = req.params;

    try {
        const carBooking = await isBookingCredentials(bookingId);
        if (carBooking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        return res.status(200).json(carBooking);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
//     const bookingId = req.params.bookingId;
//     const booking = req.body;
//
//     try {
//         const isBooking = await isBookingCredentials(bookingId);
//         if (isBooking == null) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//
//         const updatedBooking = await bookingUpdate(bookingId, booking);
//         return res.status(200).json(updatedBooking);
//     } catch (err) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
    const bookingId = req.params.bookingId;

    console.log("bookingId", bookingId);
    if (!bookingId) {
        return res.status(400).json({ message: 'bookingId is required' });
    }

    const booking = req.body;

    try {
        const isBooking = await isBookingCredentials(bookingId);  // Pass the bookingId here
        if (isBooking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const updatedBooking = await bookingUpdate(bookingId, booking);
        return res.status(200).json(updatedBooking);
    } catch (err) {
        console.error("Error updating booking:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

