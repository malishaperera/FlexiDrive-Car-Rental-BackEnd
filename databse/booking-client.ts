import { PrismaClient } from "@prisma/client";
import { generateBookingId } from "../controllers/util/generateID.controller";
import { isCarCredentials } from "./car-client";

const prisma = new PrismaClient();

export const createBooking = async (
    carIds: string[],
    customerId: string,
    pickupDate: string,
    returnDate: string,
    pickupTime: string,
    returnTime: string,
    pickupLocation: string
) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (isNaN(pickup.getTime()) || isNaN(returnD.getTime())) {
        throw new Error('Invalid date format');
    }

    const rentalDays = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));

    try {
        const transaction = await prisma.$transaction(async (prisma) => {
            const bookingId = await generateBookingId();

            let totalAmount = 0;

            // Create the booking entry
            const booking = await prisma.booking.create({
                data: {
                    bookingId,
                    customerId,
                    pickupLocation,
                    pickupDate: pickup,
                    returnDate: returnD,
                    pickupTime,
                    returnTime,
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

            const updatedBooking = await prisma.booking.update({
                where: { bookingId },
                data: { totalAmount },
            });

            return updatedBooking;
        });

        return transaction;
    } catch (err) {
        console.error('Error during booking creation:', err);
        throw new Error('Error creating booking');
    }
};

// export async function bookingAll() {
//     try {
//         const bookings = await prisma.booking.findMany();
//         return bookings;
//     } catch (err) {
//         console.error('Error in getAllBookings:', err);
//         throw new Error('Error getting all bookings');
//     }
// }

export async function bookingAll() {
    try {
        // Fetch all bookings and include the associated BookingCar and Car data
        const bookings = await prisma.booking.findMany({
            include: {
                bookingCar: {
                    include: {
                        car: true // This will include the related car details
                    }
                }
            }
        });
        return bookings;
    } catch (err) {
        console.error('Error in getAllBookings:', err);
        throw new Error('Error getting all bookings');
    }
}

export async function isBookingCredentials(bookingId: string) {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const booking = await prisma.booking.findUnique({
            where: { bookingId: bookingId }
        });
        return booking;
    } catch (err) {
        console.error("Error in isBookingCredentials:", err);
        throw new Error('Error verifying booking credentials');
    }
}


export async function bookingUpdate(bookingId: string, booking: any) {
    try {
        const updatedBooking = await prisma.booking.update({
            where: { bookingId: bookingId },
            data: booking
        });
        return updatedBooking;
    } catch (err) {
        console.error("Error in bookingUpdate:", err);
        throw new Error('Error updating booking');
    }
}