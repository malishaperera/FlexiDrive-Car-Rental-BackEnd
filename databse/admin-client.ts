import {PrismaClient, Role} from '@prisma/client';
import Admin from "../models/Admin";
import {generateAdminId} from "../controllers/util/generateID.controller";

const prisma = new PrismaClient();

export async function createAdminUser(adminUsr: Admin) {
    try {

        const newAdminId = await generateAdminId();

        const newAdmin = await prisma.admin.create({
            data: {
                adminId: newAdminId,
                name: adminUsr.username,
                email: adminUsr.email,
                password: adminUsr.password,
                phone: adminUsr.phone,
                role: adminUsr.role as Role
            }
        });
        return newAdmin;
    } catch (err) {
        console.error("Error creating admin:", err);
        throw err;
    }
}

export async function verifyAdminCredentials(email: string) {
    try {
        let adminUser = await prisma.admin.findUnique({
            where: { email:email}
        });

        return adminUser;
    } catch (err) {
        console.error("Error verifying admin credentials:", err);
        throw new Error('Error verifying admin credentials');
    }
}