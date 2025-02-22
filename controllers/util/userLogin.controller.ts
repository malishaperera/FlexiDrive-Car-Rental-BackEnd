import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {verifyCustomerCredentials} from "../../databse/customer-client";
import {verifyAdminCredentials} from "../../databse/admin-client";
import {generateAccessToken} from "./token.controller";


dotenv.config();

export const userLogin = async (req: Request, res: Response): Promise<any> => {

    const { email, password } = req.body;

    try {

        let isCustomer = await verifyCustomerCredentials(email);

        if (!isCustomer) {

            let isAdmin = await verifyAdminCredentials(email);

            if (!isAdmin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatchAdminPassword = await bcrypt.compare(password, isAdmin.password);
            if (!isMatchAdminPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const accessToken = generateAccessToken(isAdmin.adminId,isAdmin.name,isAdmin.email, isAdmin.role,isAdmin.phone);
            return res.status(200).json({
                userId: isAdmin.adminId,
                name: isAdmin.name,
                email: isAdmin.email,
                role: isAdmin.role,
                token: accessToken,
            });


        }else{

            const isMatchCustomerPassword = await bcrypt.compare(password, isCustomer.password);
            if (!isMatchCustomerPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const accessToken = generateAccessToken(isCustomer.customerId, isCustomer.name,isCustomer.email, isCustomer.role,isCustomer.phone);
            return res.status(200).json({
                customerId: isCustomer.customerId,
                name: isCustomer.name,
                email: isCustomer.email,
                phone: isCustomer.phone,
                role: isCustomer.role,
                token: accessToken
            });
        }

    }catch (err){
        console.error("Error in customerLogin:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });

    }
}






