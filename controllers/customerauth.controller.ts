import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Customer from "../models/Customer";
import {
    createCustomer, customerDelete, customerUpdate,
    getAllCustomers,
    isCustomerCredentials,
    verifyCustomerCredentials
} from "../databse/customer-client";
import {generateAccessToken} from "./util/token.controller";

dotenv.config();




export const registerCustomer  = async (req: Request, res: Response): Promise<any> => {
    const {name, email, password, phone} = req.body;

    const customer:Customer = {name, email, password, phone, address: null, nic: null, nicPhoto1: null, nicPhoto2: null, driverLicenseNum: null, driverLicensePhoto: null};

    try {

        let registration = await verifyCustomerCredentials(customer.email);

        if (registration != null) {
            return res.status(401).json({ message: 'User already exists' });
        }

        customer.password = await bcrypt.hash(customer.password, 10);

        const newCustomer = await createCustomer(customer);
        return res.status(201).json({
            message: 'Customer registered successfully',
            customer: newCustomer,
        });
    }catch (err){
        console.error("Error in registerCustomer:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}


//this customer login
// export const customerLogin = async (req: Request, res: Response): Promise<any> => {
//     const {email , password} = req.body;
//
//     try{
//         let isCustomer = await verifyCustomerCredentials(email);
//         if (isCustomer == null) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//
//         const isMatch = await bcrypt.compare(password, isCustomer.password);
//         if (!isMatch) {
//             // return res.status(401).json({ message: 'Invalid credentials' });
//             return res.status(401).json({ message: 'Invalid credentials' });
//
//         }
//
//         const accessToken = generateAccessToken(isCustomer.customerId, isCustomer.name,isCustomer.email, isCustomer.role,isCustomer.phone);
//         return res.status(200).json({
//             customerId: isCustomer.customerId,
//             name: isCustomer.name,
//             email: isCustomer.email,
//             phone: isCustomer.phone,
//             token: accessToken
//         });
//     }catch (err){
//         console.error("Error in customerLogin:", err);
//         return res.status(500).json({
//             message: 'Internal Server Error',
//             error: err,
//         });
//     }
// }

export const getAllCustomer = async (req: Request, res: Response): Promise<any> => {
    try{
        const customers = await getAllCustomers();
        console.log(customers,"cscs")
        return res.status(200).json(customers);
    }catch (err){
        console.error("Error in getAllCustomer:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}


export const getCustomerById = async (req: Request, res: Response): Promise<any> => {
    const {customerId} = req.params;

    console.log("customerId",customerId);

    try{
        const customer = await isCustomerCredentials(customerId);
        if (customer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log(customer)
        return res.status(200).json(customer);
    }catch (err){
        console.error("Error in getCustomerById:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}

export const updateCustomer = async (req: Request, res: Response): Promise<any> => {


    const customerId = req.params.customerId;
    const customer:Customer = req.body;

    console.log(req.body);

    try{
        const isCustomer = await isCustomerCredentials(customerId);
        if (isCustomer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const updatedCustomer = await customerUpdate(customerId, customer);
        return res.status(200).json(updatedCustomer);
    }catch (err){
        console.error("Error in updateCustomer:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}

export const deleteCustomer = async (req: Request, res: Response): Promise<any> => {
    const customerId = req.params.customerId;

    console.log("customerId",customerId);
    try{
        const customer = await isCustomerCredentials(customerId);
        if (customer == null) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const deletedCustomer = await customerDelete(customerId);
        return res.status(200).json({
            message: 'Customer deleted successfully',
        });
    }catch (err){
        console.error("Error in deleteCustomer:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}