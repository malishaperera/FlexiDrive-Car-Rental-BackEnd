// import dotenv from 'dotenv';
// import { Request, Response } from "express"
// import {createAdmin, verifyAdminCredentials} from "../databse/admin-client";
// import {generateAccessToken,generateRefreshToken} from "./util/auth.controller";
// import {createCustomer,verifyCustomerCredentials} from "../databse/customer-client";
// import jwt from 'jsonwebtoken';
//

// dotenv.config();



// export const adminLogin = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { email, password } = req.body;
//
//         if (!email || !password) {
//             res.status(400).json({ message: "Invalid credentials" });
//             return;
//         }
//
//         const admin = await verifyAdminCredentials({ email, password });
//
//         if (!admin) {
//             res.status(401).json({ message: "Invalid email or password" });
//             return;
//         }
//
//
//         const accessToken = generateAccessToken(admin.adminId, email);
//         // const refreshToken = generateRefreshToken(admin.adminId, email);
//
//
//         res.status(200).json({
//             message: "Login successful",
//             accessToken,
//             // refreshToken
//         });
//
//     } catch (err) {
//         console.error("Error in adminLogin:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
//

// export const adminLogin = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { email, password } = req.body;
//
//         if (!email || !password) {
//             res.status(400).json({ message: "Invalid credentials" });
//             return;
//         }
//
//         // Verify the admin credentials
//         const admin = await verifyAdminCredentials({ email, password });
//
//         if (!admin) {
//             res.status(401).json({ message: "Invalid email or password" });
//             return;
//         }
//
//         // If credentials are correct, generate token
//         const token = jwt.sign(
//             {
//                 adminId: admin.adminId,
//                 email: admin.email,
//                 role: admin.role, // Optional, add role or other fields if needed
//                 name: admin.name // Add any additional data to send back to the user
//             },
//             process.env.JWT_SECRET as string, // Secret key from environment variables
//             { expiresIn: '1h' } // Set token expiration (optional)
//         );
//
//         // Respond with both token and admin data
//         res.status(200).json({
//             message: "Login successful",
//             token: token,
//             admin: {
//                 adminId: admin.adminId,
//                 email: admin.email,
//                 name: admin.name,
//                 role: admin.role // Include additional admin data you want to send
//             }
//         });
//
//     } catch (err) {
//         console.error("Error in adminLogin:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
// export const customerRegister = async (req: Request, res: Response) => {
//
//     try {
//
//         const customerData = req.body;
//
//         const newCustomer = await createCustomer(customerData);
//         res.status(201).json(
//             {
//                 message: 'Customer created successfully', customer: newCustomer
//             }
//         );
//     }catch (err){
//         res.status(500).json({
//             message:'Internal Server Error',
//             error: err
//         });
//     }
// }


// export const customerLogin = async (req: Request, res: Response) => {
//
//     try{
//         const { email, password } = req.body;
//
//         if (!email || !password) {
//             res.status(400).json({ message: "Invalid credentials" });
//             return;
//         }
//
//         const customer = await verifyCustomerCredentials({ email, password });
//
//         if (!customer) {
//             res.status(401).json({ message: "Invalid email or password" });
//             return;
//         }
//
//         const accessToken = generateAccessToken(customer.customerId, email);
//         // const refreshToken = generateRefreshToken(customer.customerId, email);
//
//         res.status(200).json({
//             message: "Login successful",
//             accessToken,
//             // refreshToken
//         });
//
//     }catch (err){
//         res.status(500).json({
//             message:'Internal Server Error',
//             error: err
//         })
//     }
// }