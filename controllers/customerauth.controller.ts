import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Customer from "../models/Customer";
import {createCustomer, verifyCustomerCredentials} from "../databse/customer-client";

dotenv.config();

export const generateAccessToken = (adminId: string, email: string, role: string,phone:string) => {
    return jwt.sign(
        { adminId, email, role },
        process.env.JWT_SECRET as Secret,
        { expiresIn: '45m' }

    );
};

export const registerCustomer  = async (req: Request, res: Response): Promise<any> => {
    const {name, email, password, phone} = req.body;

    const customer:Customer = {name, email, password, phone, address: null, nic: null, nicPhoto1: null, nicPhoto2: null};

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


export const customerLogin = async (req: Request, res: Response): Promise<any> => {
    const {email , password} = req.body;

    try{
        let isCustomer = await verifyCustomerCredentials(email);
        if (isCustomer == null) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, isCustomer.password);
        if (!isMatch) {
            // return res.status(401).json({ message: 'Invalid credentials' });
            return res.status(401).json({ message: 'Invalid credentials' });

        }

        const accessToken = generateAccessToken(isCustomer.customerId, isCustomer.email, isCustomer.role,isCustomer.phone);
        return res.status(200).json({
            customerId: isCustomer.customerId,
            name: isCustomer.name,
            email: isCustomer.email,
            phone: isCustomer.phone,
            token: accessToken
        });
    }catch (err){
        console.error("Error in customerLogin:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}


export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as Secret) as {
            email: string
        };

        const customer = await verifyCustomerCredentials(decoded.email);

        if (!customer) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }


        const accessNewToken = jwt.sign(
            { customerId: customer.customerId, email: customer.email, role: customer.role },
            process.env.JWT_SECRET as Secret,
            { expiresIn: '2h' }
        )

        return res.json({ accessToken: accessNewToken });

    }catch (err){
        console.error("Error in refreshToken:", err);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}




