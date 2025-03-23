// import dotenv from "dotenv";
// import { Request, Response } from "express";
// import {bookingAll, bookingUpdate, createBooking, isBookingCredentials} from "../databse/booking-client";
// import { isCustomerCredentials } from "../databse/customer-client";
//
// dotenv.config();
//
// export const carBooking = async (req: Request, res: Response): Promise<any> => {
//
//     console.log(req.body);
//     try {
//         const { carId, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation } = req.body;
//         console.log(carId+"sccscscs");
//
//         if (!Array.isArray(carId) || carId.length === 0) {
//             return res.status(400).json({ message: 'Please provide a list of car IDs' });
//         }
//
//         const isCustomer = await isCustomerCredentials(customerId);
//         if (isCustomer == null) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }
//
//         // Booking create function call
//         const booking = await createBooking(carId, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation);
//
//         return res.status(200).json({
//             message: 'Booking successfully created',
//             booking,
//             totalAmount: booking.totalAmount,
//         });
//
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
//
// export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
//     try {
//         console.log("mekedabn")
//         const carBooking = await bookingAll();
//         return res.status(200).json(carBooking);
//     } catch (err) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
//
// export const getBookingById = async (req: Request, res: Response): Promise<any> => {
//     const { bookingId } = req.params;
//
//     try {
//         const carBooking = await isBookingCredentials(bookingId);
//         if (carBooking == null) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//         return res.status(200).json(carBooking);
//     } catch (err) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
//
// // export const carBookingUpdate = kalinasync (req: Request, res: Response): Promise<any> => {
// //     const bookingId = req.params.bookingId;
// //     const booking = req.body;
// //
// //     try {
// //         const isBooking = await isBookingCredentials(bookingId);
// //         if (isBooking == null) {
// //             return res.status(404).json({ message: 'Booking not found' });
// //         }
// //
// //         const updatedBooking = await bookingUpdate(bookingId, booking);
// //         return res.status(200).json(updatedBooking);
// //     } catch (err) {
// //         return res.status(500).json({ message: "Internal Server Error" });
// //     }
// // }
//
// export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
//     const bookingId = req.params.bookingId;
//
//     console.log("bookingId", bookingId);
//     if (!bookingId) {
//         return res.status(400).json({ message: 'bookingId is required' });
//     }
//
//     const booking = req.body;
//
//     try {
//         const isBooking = await isBookingCredentials(bookingId);  // Pass the bookingId here
//         if (isBooking == null) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//
//         const updatedBooking = await bookingUpdate(bookingId, booking);
//         return res.status(200).json(updatedBooking);
//     } catch (err) {
//         console.error("Error updating booking:", err);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };
//

// import dotenv from "dotenv";
// import { Request, Response } from "express";
// import {
//     bookingAll,
//     bookingUpdate,
//     createBooking,
//     isBookingCredentials
// } from "../databse/booking-client";
// import { isCustomerCredentials } from "../databse/customer-client";
//
// dotenv.config();
//
// export const carBooking = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { carIds, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation } = req.body;
//
//         if (!Array.isArray(carIds) || carIds.length === 0) {
//             return res.status(400).json({ message: 'Invalid or empty car IDs list' });
//         }
//
//         const isCustomer = await isCustomerCredentials(customerId);
//         if (!isCustomer) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }
//
//         const booking = await createBooking(
//             carIds,
//             customerId,
//             pickupDate,
//             returnDate,
//             pickupTime,
//             returnTime,
//             pickupLocation
//         );
//
//         return res.status(201).json({
//             message: 'Booking created successfully',
//             bookingId: booking.bookingId,
//             totalAmount: booking.totalAmount,
//             status: booking.status
//         });
//
//     } catch (err) {
//         console.error('Booking error:', err);
//         return res.status(500).json({
//             message: err instanceof Error ? err.message : 'Internal server error'
//         });
//     }
// };
//
// export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const bookings = await bookingAll();
//         return res.status(200).json({
//             count: bookings.length,
//             bookings
//         });
//     } catch (err) {
//         console.error('Get all bookings error:', err);
//         return res.status(500).json({
//             message: err instanceof Error ? err.message : 'Internal server error'
//         });
//     }
// };
//
// export const getBookingById = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { bookingId } = req.params;
//         const booking = await isBookingCredentials(bookingId);
//
//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }
//
//         return res.status(200).json(booking);
//     } catch (err) {
//         console.error('Get booking error:', err);
//         return res.status(500).json({
//             message: err instanceof Error ? err.message : 'Internal server error'
//         });
//     }
// };
//
// export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { bookingId } = req.params;
//         const { carIds, ...bookingData } = req.body;
//
//         if (!bookingId) {
//             return res.status(400).json({ message: 'Booking ID is required' });
//         }
//
//         const updatedBooking = await bookingUpdate(bookingId, {
//             ...bookingData,
//             carIds
//         });
//
//         return res.status(200).json({
//             message: 'Booking updated successfully',
//             booking: updatedBooking
//         });
//
//     } catch (err) {
//         console.error('Update booking error:', err);
//         return res.status(500).json({
//             message: err instanceof Error ? err.message : 'Internal server error'
//         });
//     }
// };
//////

import dotenv from "dotenv";
import { Request, Response } from "express";
import {
    bookingAll,
    bookingUpdate,
    createBooking,
    isBookingCredentials
} from "../databse/booking-client";
import { isCustomerCredentials } from "../databse/customer-client";

dotenv.config();

export const carBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const { carIds, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation } = req.body;
        console.log(carIds, customerId, pickupDate, returnDate, pickupTime, returnTime, pickupLocation);

        if (!Array.isArray(carIds) || carIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty car IDs list' });
        }

        const isCustomer = await isCustomerCredentials(customerId);
        if (!isCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const booking = await createBooking(
            carIds,
            customerId,
            pickupDate,
            returnDate,
            pickupTime,
            returnTime,
            pickupLocation
        );

        return res.status(201).json({
            message: 'Booking created successfully',
            bookingId: booking.bookingId,
            totalAmount: booking.totalAmount,
            status: booking.status
        });

    } catch (err) {
        console.error('Booking error:', err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal server error'
        });
    }
};

export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
    try {
        const bookings = await bookingAll();
        return res.status(200).json({
            count: bookings.length,
            bookings
        });
    } catch (err) {
        console.error('Get all bookings error:', err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal server error'
        });
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { bookingId } = req.params;
        const booking = await isBookingCredentials(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json(booking);
    } catch (err) {
        console.error('Get booking error:', err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal server error'
        });
    }
};

export const carBookingUpdate = async (req: Request, res: Response): Promise<any> => {
    try {
        const { bookingId } = req.params;
        const { carIds, ...bookingData } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const updatedBooking = await bookingUpdate(bookingId, {
            ...bookingData,
            carIds
        });

        return res.status(200).json({
            message: 'Booking updated successfully',
            booking: updatedBooking
        });

    } catch (err) {
        console.error('Update booking error:', err);
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Internal server error'
        });
    }
};