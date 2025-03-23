// import { PrismaClient } from "@prisma/client";
// import { generateBookingId } from "../controllers/util/generateID.controller";
// import { isCarCredentials } from "./car-client";
//
// const prisma = new PrismaClient();
//
// export const createBooking = async (
//     carIds: string[],
//     customerId: string,
//     pickupDate: string,
//     returnDate: string,
//     pickupTime: string,
//     returnTime: string,
//     pickupLocation: string
// ) => {
//     const pickup = new Date(pickupDate);
//     const returnD = new Date(returnDate);
//
//     if (isNaN(pickup.getTime()) || isNaN(returnD.getTime())) {
//         throw new Error('Invalid date format');
//     }
//
//     const rentalDays = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
//
//     try {
//         const transaction = await prisma.$transaction(async (prisma) => {
//             const bookingId = await generateBookingId();
//
//             let totalAmount = 0;
//
//             // Create the booking entry
//             const booking = await prisma.booking.create({
//                 data: {
//                     bookingId,
//                     customerId,
//                     pickupLocation,
//                     pickupDate: pickup,
//                     returnDate: returnD,
//                     pickupTime,
//                     returnTime,
//                     status: 'PENDING',
//                     totalAmount: 0,
//                 },
//             });
//
//             const carBookingPromises = carIds.map(async (carId) => {
//                 const isCar = await isCarCredentials(carId);
//                 if (isCar == null) {
//                     throw new Error(`Car with ID ${carId} not found`);
//                 }
//
//                 const carTotalAmount = rentalDays * Number(isCar.pricePerDay);
//                 totalAmount += carTotalAmount;
//
//                 await prisma.bookingCar.create({
//                     data: {
//                         bookingId,
//                         carId,
//                     },
//                 });
//             });
//
//             await Promise.all(carBookingPromises);
//
//             const updatedBooking = await prisma.booking.update({
//                 where: { bookingId },
//                 data: { totalAmount },
//             });
//
//             return updatedBooking;
//         });
//
//         return transaction;
//     } catch (err) {
//         console.error('Error during booking creation:', err);
//         throw new Error('Error creating booking');
//     }
// };
//
// // export async function bookingAll() {
// //     try {
// //         const bookings = await prisma.booking.findMany();
// //         return bookings;
// //     } catch (err) {
// //         console.error('Error in getAllBookings:', err);
// //         throw new Error('Error getting all bookings');
// //     }
// // }
//
// export async function bookingAll() {
//     try {
//         // Fetch all bookings and include the associated BookingCar and Car data
//         const bookings = await prisma.booking.findMany({
//             include: {
//                 bookingCar: {
//                     include: {
//                         car: true // This will include the related car details
//                     }
//                 }
//             }
//         });
//         return bookings;
//     } catch (err) {
//         console.error('Error in getAllBookings:', err);
//         throw new Error('Error getting all bookings');
//     }
// }
//
// export async function isBookingCredentials(bookingId: string) {
//     try {
//         if (!bookingId) {
//             throw new Error("bookingId is required");
//         }
//
//         const booking = await prisma.booking.findUnique({
//             where: { bookingId: bookingId }
//         });
//         return booking;
//     } catch (err) {
//         console.error("Error in isBookingCredentials:", err);
//         throw new Error('Error verifying booking credentials');
//     }
// }
//
//
// // export async function meka kalinma bookingUpdate(bookingId: string, booking: any) {
// //     try {
// //         const updatedBooking = await prisma.booking.update({
// //             where: { bookingId: bookingId },
// //             data: booking
// //         });
// //         return updatedBooking;
// //     } catch (err) {
// //         console.error("Error in bookingUpdate:", err);
// //         throw new Error('Error updating booking');
// //     }
// // }
// export async function bookingUpdate(bookingId: string, booking: any) {
//     try {
//         const updatedBooking = await prisma.booking.update({
//             where: {
//                 bookingId: bookingId, // Use the dynamic bookingId
//             },
//             data: {
//                 customerId: booking.customerId,
//                 pickupLocation: booking.pickupLocation,
//                 pickupDate: booking.pickupDate,
//                 returnDate: booking.returnDate,
//                 pickupTime: booking.pickupTime,
//                 returnTime: booking.returnTime,
//                 status: booking.status,
//                 totalAmount: booking.totalAmount,
//                 // Assuming you want to update the related cars
//                 bookingCar: {
//                     // Use connect to link existing cars by their carId
//                     connect: booking.bookingCar.map((car: any) => ({
//                         carId: car.carId,
//                     })),
//                 },
//             },
//         });
//
//         console.log("Booking updated successfully", updatedBooking);
//         return updatedBooking;
//     } catch (error) {
//         console.error("Error updating booking:", error);
//         throw new Error("Error updating booking");
//     }
// }


/////

import { PrismaClient } from "@prisma/client";
import { generateBookingId } from "../controllers/util/generateID.controller";
import { isCarCredentials } from "./car-client";

const prisma = new PrismaClient();

// export const createBooking = async (
//     carIds: string[],
//     customerId: string,
//     pickupDate: string,
//     returnDate: string,
//     pickupTime: string,
//     returnTime: string,
//     pickupLocation: string
// ) => {
//     try {
//         return await prisma.$transaction(async (tx) => {
//             // Validate dates
//             const pickup = new Date(pickupDate);
//             const returnD = new Date(returnDate);
//
//             if (isNaN(pickup.getTime())) throw new Error('Invalid pickup date');
//             if (isNaN(returnD.getTime())) throw new Error('Invalid return date');
//             if (pickup >= returnD) throw new Error('Return date must be after pickup date');
//
//             // Check car availability
//             const availableCars = await tx.car.findMany({
//                 where: {
//                     carId: { in: carIds },
//                     status: 'AVAILABLE'
//                 }
//             });
//
//             if (availableCars.length !== carIds.length) {
//                 throw new Error('One or more cars are not available');
//             }
//
//             // Calculate rental days
//             const timeDiff = returnD.getTime() - pickup.getTime();
//             const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//
//             // Create booking
//             const bookingId = await generateBookingId();
//             const totalAmount = availableCars.reduce(
//                 (sum, car) => sum + (Number(car.pricePerDay) * rentalDays),
//                 0
//             );
//
//             // Create booking with cars
//             const booking = await tx.booking.create({
//                 data: {
//                     bookingId,
//                     customerId,
//                     pickupLocation,
//                     pickupDate: pickup,
//                     returnDate: returnD,
//                     pickupTime,
//                     returnTime,
//                     status: 'PENDING',
//                     totalAmount,
//                     bookingCar: {
//                         createMany: {
//                             data: carIds.map(carId => ({ carId }))
//                         }
//                     }
//                 },
//                 include: {
//                     bookingCar: {
//                         include: {
//                             car: true
//                         }
//                     }
//                 }
//             });
//
//             // Update car statuses
//             await tx.car.updateMany({
//                 where: { carId: { in: carIds } },
//                 data: { status: 'RENTED' }
//             });
//
//             return booking;
//         });
//     } catch (err) {
//         console.error('Booking creation error:', err);
//         throw new Error(err instanceof Error ? err.message : 'Failed to create booking');
//     }
// };
/////////////////////////////

// export const meka createBooking = async (
//     carIds: string[],
//     customerId: string,
//     pickupDate: string,
//     returnDate: string,
//     pickupTime: string,
//     returnTime: string,
//     pickupLocation: string
// ) => {
//     try {
//         return await prisma.$transaction(async (tx) => {
//             // Validate dates
//             const pickup = new Date(pickupDate);
//             const returnD = new Date(returnDate);
//
//             if (isNaN(pickup.getTime())) throw new Error('Invalid pickup date format (use YYYY-MM-DD)');
//             if (isNaN(returnD.getTime())) throw new Error('Invalid return date format (use YYYY-MM-DD)');
//             if (pickup >= returnD) throw new Error('Return date must be after pickup date');
//
//             // Check car availability with detailed error
//             const availableCars = await tx.car.findMany({
//                 where: {
//                     carId: { in: carIds },
//                     status: 'AVAILABLE'
//                 }
//             });
//
//             if (availableCars.length !== carIds.length) {
//                 const unavailableCars = carIds.filter(id =>
//                     !availableCars.some(c => c.carId === id)
//                 );
//                 throw new Error(
//                     `Unavailable cars: ${unavailableCars.join(', ')}. ` +
//                     `Possible reasons: ` +
//                     `1. Car ID doesn't exist\n` +
//                     `2. Car is already booked\n` +
//                     `3. Car is under maintenance`
//                 );
//             }
//
//             // Calculate rental days
//             const timeDiff = returnD.getTime() - pickup.getTime();
//             const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
//
//             // Create booking ID
//             const bookingId = await generateBookingId();
//
//             // Calculate total amount
//             const totalAmount = availableCars.reduce(
//                 (sum, car) => sum + (Number(car.pricePerDay) * rentalDays),
//                 0
//             );
//
//             // Create booking record
//             const booking = await tx.booking.create({
//                 data: {
//                     bookingId,
//                     customerId,
//                     pickupLocation,
//                     pickupDate: pickup,
//                     returnDate: returnD,
//                     pickupTime,
//                     returnTime,
//                     status: 'PENDING',
//                     totalAmount,
//                     bookingCar: {
//                         createMany: {
//                             data: carIds.map(carId => ({ carId }))
//                         }
//                     }
//                 },
//                 include: {
//                     bookingCar: {
//                         include: {
//                             car: true
//                         }
//                     }
//                 }
//             });
//
//             // Update car statuses
//             await tx.car.updateMany({
//                 where: { carId: { in: carIds } },
//                 data: { status: 'RENTED' }
//             });
//
//             return booking;
//         });
//     } catch (err) {
//         console.error('Booking creation error:', err);
//         throw new Error(err instanceof Error ? err.message : 'Failed to create booking');
//     }
// };

interface BookingDetails {
    bookingId: string;
    totalAmount: number;
    status: string;
    cars: string[];
}
export const createBooking = async (
    carIds: string[],
    customerId: string,
    pickupDate: string,
    returnDate: string,
    pickupTime: string,
    returnTime: string,
    pickupLocation: string
): Promise<BookingDetails> => {
    try {
        return await prisma.$transaction(async (tx) => {
            // Debug: Log input parameters
            console.log('Starting booking for cars:', carIds);
            console.log('Customer:', customerId);
            console.log('Pickup Date:', pickupDate);
            console.log('Return Date:', returnDate);

            // Validate dates
            const pickup = new Date(pickupDate);
            const returnD = new Date(returnDate);

            if (isNaN(pickup.getTime())) {
                throw new Error('Invalid pickup date format (YYYY-MM-DD required)');
            }
            if (isNaN(returnD.getTime())) {
                throw new Error('Invalid return date format (YYYY-MM-DD required)');
            }
            if (pickup >= returnD) {
                throw new Error('Return date must be at least 1 hour after pickup');
            }

            // Check car availability with debug logging
            console.log('Checking availability for cars:', carIds);
            const availableCars = await tx.car.findMany({
                where: {
                    carId: { in: carIds },
                    status: 'AVAILABLE'
                },
                select: {
                    carId: true,
                    status: true,
                    pricePerDay: true
                }
            });

            console.log('Available cars found:', availableCars.map(c => c.carId));

            if (availableCars.length !== carIds.length) {
                const unavailableCars = carIds.filter(id =>
                    !availableCars.some(c => c.carId === id)
                );

                // Detailed error message
                const errorMessage = [
                    `Unavailable cars: ${unavailableCars.join(', ')}`,
                    'Possible issues:',
                    `1. Car ID(s) not found in database`,
                    `2. Car status not 'AVAILABLE'`,
                    `3. Existing booking conflict`
                ].join('\n');

                throw new Error(errorMessage);
            }

            // Calculate rental period
            const rentalDays = Math.ceil(
                (returnD.getTime() - pickup.getTime()) / (1000 * 3600 * 24)
            );

            // Create booking ID
            const bookingId = await generateBookingId();

            // Calculate total price
            const totalAmount = availableCars.reduce(
                (sum, car) => sum + (Number(car.pricePerDay) * rentalDays),
                0
            );

            console.log('Creating booking:', bookingId);

            // Create booking record
            await tx.booking.create({
                data: {
                    bookingId,
                    customerId,
                    pickupLocation,
                    pickupDate: pickup,
                    returnDate: returnD,
                    pickupTime,
                    returnTime,
                    status: 'PENDING',
                    totalAmount,
                    bookingCar: {
                        createMany: {
                            data: carIds.map(carId => ({ carId }))
                        }
                    }
                }
            });

            // Update car statuses
            console.log('Updating car statuses to RENTED');
            await tx.car.updateMany({
                where: { carId: { in: carIds } },
                data: { status: 'RENTED' }
            });

            return {
                bookingId,
                totalAmount,
                status: 'PENDING',
                cars: carIds
            };
        });
    } catch (error) {
        console.error('[Booking Error]', error);
        throw new Error(
            error instanceof Error ? error.message : 'Failed to create booking'
        );
    }
};

export async function bookingAll() {
    try {
        return await prisma.booking.findMany({
            include: {
                bookingCar: {
                    include: {
                        car: true
                    }
                },
                customer: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (err) {
        console.error('Get all bookings error:', err);
        throw new Error('Failed to retrieve bookings');
    }
}

export async function isBookingCredentials(bookingId: string) {
    try {
        return await prisma.booking.findUnique({
            where: { bookingId },
            include: {
                bookingCar: {
                    include: {
                        car: true
                    }
                },
                customer: true
            }
        });
    } catch (err) {
        console.error('Find booking error:', err);
        throw new Error('Failed to find booking');
    }
}

export async function bookingUpdate(bookingId: string, updateData: any) {
    try {
        return await prisma.$transaction(async (tx) => {
            // Handle car associations
            if (updateData.carIds) {
                // Remove existing car associations
                await tx.bookingCar.deleteMany({
                    where: { bookingId }
                });

                // Create new associations
                await tx.bookingCar.createMany({
                    data: updateData.carIds.map((carId: string) => ({
                        bookingId,
                        carId
                    }))
                });

                // Recalculate total amount
                const booking = await tx.booking.findUnique({
                    where: { bookingId }
                });

                if (!booking) {
                    throw new Error('Booking not found');
                }

                const cars = await tx.car.findMany({
                    where: { carId: { in: updateData.carIds } }
                });

                const timeDiff = booking.returnDate.getTime() - booking.pickupDate.getTime();
                const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                updateData.totalAmount = cars.reduce(
                    (sum, car) => sum + (Number(car.pricePerDay) * rentalDays),
                    0
                );
            }

            // Update booking details
            return tx.booking.update({
                where: { bookingId },
                data: {
                    pickupLocation: updateData.pickupLocation,
                    pickupDate: updateData.pickupDate,
                    returnDate: updateData.returnDate,
                    pickupTime: updateData.pickupTime,
                    returnTime: updateData.returnTime,
                    status: updateData.status,
                    totalAmount: updateData.totalAmount
                },
                include: {
                    bookingCar: {
                        include: {
                            car: true
                        }
                    },
                    customer: true
                }
            });
        });
    } catch (err) {
        console.error('Booking update error:', err);
        throw new Error(err instanceof Error ? err.message : 'Failed to update booking');
    }
}