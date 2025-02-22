import { PrismaClient } from "@prisma/client";
import {generateBookingId} from "../controllers/util/generateID.controller";
import {isCarCredentials} from "./car-client";

const prisma = new PrismaClient();

export const createBooking = async (
    carIds: string[],
    customerId: string,
    startDate: string,
    endDate: string,
    location: string
) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
    }

    const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    try {
        const transaction = await prisma.$transaction(async (prisma) => {
            const bookingId = await generateBookingId();

            let totalAmount = 0;

            const booking = await prisma.booking.create({
                data: {
                    bookingId,
                    customerId,
                    startDate: start,
                    endDate: end,
                    location,
                    status: 'PENDING',
                    totalAmount: 0,
                },
            });

            const carBookingPromises = carIds.map(async (carId) => {
                const isCar = await isCarCredentials(carId);
                if (isCar == null) {
                    throw new Error(`Car with ID ${carId} not found`);
                }

                const carTotalAmount = rentalDays * Number(isCar.pricePerDay);
                totalAmount += carTotalAmount;

                await prisma.bookingCar.create({
                    data: {
                        bookingId,
                        carId,
                    },
                });
            });

            await Promise.all(carBookingPromises);

            await prisma.booking.update({
                where: { bookingId },
                data: { totalAmount },
            });

            return booking;
        });

        return transaction;
    } catch (err) {
        throw new Error('Error bookings',);
    }
};

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