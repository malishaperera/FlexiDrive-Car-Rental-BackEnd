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

export async function isAdminCredentials(adminId: string) {
    try {
        let adminUser = await prisma.admin.findUnique({
            where: { adminId: adminId }
        });

        return adminUser;
    } catch (err) {
        console.error("Error verifying admin id:", err);
        throw new Error('Error verifying admin id');
    }
}

export async function getAllAdmins() {
    try {
        const admins = await prisma.admin.findMany();
        return admins;
    } catch (err) {
        console.error("Error getting all admins:", err);
        throw new Error('Error getting all admins');
    }
}

export async function adminUpdate(adminId:string,admin:Admin){
    try{
        const updatedAdmin = await prisma.admin.update({
            where: { adminId: adminId },
            data: {
                name: admin.username,
                email: admin.email,
                phone: admin.phone,
                role: admin.role as Role
            }
        });
        return updatedAdmin;
    }catch (err){
        console.error("Error updating admin:", err);
        throw new Error('Error updating admin');
    }
}

export async function adminDelete(adminId:string){
    try{
        await prisma.admin.delete({
            where: { adminId: adminId }
        });
    }catch (err){
        console.error("Error deleting admin:", err);
        throw new Error('Error deleting admin');
    }
}