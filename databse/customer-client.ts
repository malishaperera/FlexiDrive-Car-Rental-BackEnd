import bcrypt from "bcrypt";
import Customer from "../models/Customer";
import { PrismaClient } from "@prisma/client";
import {generateCustomerId} from "../controllers/util/generateID.controller";

const prisma = new PrismaClient();


export async function createCustomer(customer: Customer) {

    try{

        const hashedPassword = await bcrypt.hash(customer.password, 10);

        // Generate a new adminId
        const newCustomerId = await generateCustomerId();

        const addedCustomer = await prisma.customer.create({
            data: {
                customerId: newCustomerId,
                name: null,
                email: customer.email,
                password: hashedPassword,
                phone: null,
                address: null,
                nic: null,
                nicPhoto1: null,
                nicPhoto2: null
            },
        });

        console.log("Customer created:", addedCustomer);
        return addedCustomer;
    }catch (err){
        console.error('Error in createCustomer:', err);
        throw new Error('Error creating customer');
    }


}



export async function verifyCustomerCredentials(verifyCustomer: { email: string; password: string }) {

    try{

        const customer = await prisma.customer.findUnique({
            where: {
                email: verifyCustomer.email,
            },
        });

        if (!customer) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(verifyCustomer.password, customer.password);

        if (!passwordMatch) {
            return null;
        }

        return customer;
    }catch (err){
        console.error('Error in verifyCustomerCredentials:', err);
        throw new Error('Error verifying customer credentials');
    }


}

// phone: customer.phone,
// address: customer.address,
// nic: customer.nic,
// nicPhoto1: customer.nicPhoto1,
// nicPhoto2: customer.nicPhoto2
// name: customer.name,