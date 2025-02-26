import dotenv from "dotenv";
import { Request, Response } from "express";
import { bookingAll, createBooking, isBookingCredentials } from "../databse/booking-client";
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
