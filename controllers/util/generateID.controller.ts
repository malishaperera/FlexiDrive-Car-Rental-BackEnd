import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Admin
export async function generateAdminId(): Promise<string> {
    // Fetch the last admin from the database
    const lastAdmin = await prisma.admin.findFirst({
        orderBy: { adminId: 'desc' },
    });

    // Generate next adminId (AD-001, AD-002, etc.)
    let nextId = "AD-001";
    if (lastAdmin && lastAdmin.adminId) {
        const lastIdNumber = parseInt(lastAdmin.adminId.split("-")[1], 10); // Extract number
        const newIdNumber = lastIdNumber + 1;
        nextId = `AD-${String(newIdNumber).padStart(3, "0")}`; // Format as AD-XXX
    }
    return nextId;
}

//Customer
export async function generateCustomerId(): Promise<string> {

    const lastCustomer = await prisma.customer.findFirst({
        orderBy: { customerId: 'desc' },
    });

    let nextId = "CU-001";
    if (lastCustomer && lastCustomer.customerId) {
        const lastIdNumber = parseInt(lastCustomer.customerId.split("-")[1], 10);
        const newIdNumber = lastIdNumber + 1;
        nextId = `CU-${String(newIdNumber).padStart(3, "0")}`;
    }
    return nextId;
}

//Car
export async function generateCarId(): Promise<string> {

    const lastCar = await prisma.car.findFirst({
        orderBy: { carId: 'desc' },
    });

    let nextId = "CAR-001";
    if (lastCar && lastCar.carId) {
        const lastIdNumber = parseInt(lastCar.carId.split("-")[1], 10);
        const newIdNumber = lastIdNumber + 1;
        nextId = `CAR-${String(newIdNumber).padStart(3, "0")}`;
    }
    return nextId;
}

//car Booking

export async function generateBookingId(): Promise<string> {

    const lastBooking = await prisma.booking.findFirst({
        orderBy: { bookingId: 'desc' },
    });

    let nextId = "BK-001";
    if (lastBooking && lastBooking.bookingId) {
        const lastIdNumber = parseInt(lastBooking.bookingId.split("-")[1], 10);
        const newIdNumber = lastIdNumber + 1;
        nextId = `BK-${String(newIdNumber).padStart(3, "0")}`;
    }
    return nextId;
}



// export async function generateBookingId(): Promise<string> {
//     const lastBooking = await prisma.booking.findFirst({
//         orderBy: { bookingId: 'desc' },
//     });
//
//     let nextId = "BK-001";
//     if (lastBooking && lastBooking.bookingId) {
//         const lastIdNumber = parseInt(lastBooking.bookingId.split("-")[1], 10);
//         const newIdNumber = lastIdNumber + 1;
//         nextId = `BK-${String(newIdNumber).padStart(3, "0")}`;
//     }
//     return nextId;
// }
//









