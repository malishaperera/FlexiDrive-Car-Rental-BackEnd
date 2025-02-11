import { PrismaClient } from "@prisma/client";
import Booking from "../models/Booking";
import {generateBookingId} from "../controllers/util/generateID.controller";

const prisma = new PrismaClient();

// export async function bookingCreate(booking:Booking) {
//     try{
//
//         const newBookingId = await generateBookingId();
//
//         const addedBooking = await prisma.booking.create({
//             data: {
//                 bookingId: newBookingId,
//                 customerId: booking.customerId,
//                 carId: booking.carId,
//                 startDate: new Date(booking.startDate),
//                 endDate: new Date(booking.endDate),
//                 location: booking.location,
//                 totalAmount: booking.totalAmount
//             }
//         });
//         return addedBooking;
//
//     }catch (err){
//         console.error("Error in carBooking:", err);
//         throw new Error('Error creating Booking');
//     }
// }


export async function bookingAll() {
    try{
        let bookings = await prisma.booking.findMany();
        return bookings;
    }catch (err){
        console.error('Error in getAllBookings:', err);
        throw new Error('Error getting all bookings');
    }
}

export async function isBookingCredentials(bookingId: string) {
    try{
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        let booking = await prisma.booking.findUnique({
            where: { bookingId: bookingId }
        });
        return booking;
    }catch (err){
        console.error("Error in isBookingCredentials:", err);
        throw new Error('Error verifying booking credentials');
    }
}



// const result = await prisma.$transaction([
//     prisma.payment.create({
//         data: {
//             bookingId,
//             amount,
//             method,
//             status: "SUCCESS",
//         },
//     }),
//     prisma.booking.update({
//         where: { bookingId },
//         data: { status: "CONFIRMED" },
//     }),
// ]);


export async function bookingCreate(booking: Booking) {
    try {
        // Create the booking entry in the database using the same bookingId
        const addedBooking = await prisma.booking.create({
            data: {
                bookingId: booking.bookingId,
                customerId: booking.customerId,
                carId: booking.carId,
                startDate: new Date(booking.startDate),
                endDate: new Date(booking.endDate),
                location: booking.location,
                totalAmount: booking.totalAmount
            }
        });
        return addedBooking;

    } catch (err) {
        console.error("Error in carBooking:", err);
        throw new Error('Error creating Booking');
    }
}