import bcrypt from "bcrypt";
import Customer from "../models/Customer";
import { PrismaClient } from "@prisma/client";
import {generateCustomerId} from "../controllers/util/generateID.controller";

const prisma = new PrismaClient();


export async function createCustomer(customer: Customer) {

    try{

        // Generate a new adminId
        const newCustomerId = await generateCustomerId();

        const addedCustomer = await prisma.customer.create({
            data: {
                customerId: newCustomerId,
                name: customer.name,
                email: customer.email,
                password:customer.password,
                phone: customer.phone,
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

export async function verifyCustomerCredentials( email: string) {

    try{

        let customer = await prisma.customer.findUnique({
            where: { email: email }
        });
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