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
                nicPhoto2: null,
                driverLicenseNum : null,
                driverLicensePhoto: null
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

export async function isCustomerCredentials( customerId: string) {
    try{
        if (!customerId) {
            throw new Error("customerId is required");
        }

        let customer = await prisma.customer.findUnique({
            where: { customerId: customerId }
        });
        return customer;
    }catch (err){
        console.error('Error in verifyCustomerCredentials:', err);
        throw new Error('Error verifying customer credentials');
    }
}

export async function getAllCustomers() {
    try{
        let customers = await prisma.customer.findMany();
        return customers;
    }catch (err){
        console.error('Error in getAllCustomer:', err);
        throw new Error('Error getting all customers');
    }
}

export async function customerUpdate(customerId: string, customer: Customer) {
    try{
        const updatedCustomer = await prisma.customer.update({
            where: { customerId: customerId },
            data: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                nic: customer.nic,
                nicPhoto1: customer.nicPhoto1,
                nicPhoto2: customer.nicPhoto2,
                driverLicenseNum : customer.driverLicenseNum,
                driverLicensePhoto: customer.driverLicensePhoto || null



            }
        });
        return updatedCustomer;
    }catch (err){
        console.error('Error in updateCustomer:', err);
        throw new Error('Error updating customer');
    }
}

export async function customerDelete(customerId: string) {
    try{
        const deletedCustomer = await prisma.customer.delete({
            where: { customerId: customerId }
        });
        return deletedCustomer;
    }catch (err){
        console.error('Error in deleteCustomer:', err);
        throw new Error('Error deleting customer');
    }
}


// phone: customer.phone,
// address: customer.address,
// nic: customer.nic,
// nicPhoto1: customer.nicPhoto1,
// nicPhoto2: customer.nicPhoto2
// name: customer.name,