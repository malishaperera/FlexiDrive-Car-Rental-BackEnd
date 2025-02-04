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









