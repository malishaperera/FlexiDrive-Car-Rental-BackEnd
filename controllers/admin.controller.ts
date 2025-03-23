import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from "../models/Admin";
import {
    adminDelete,
    adminUpdate,
    createAdminUser,
    getAllAdmins,
    isAdminCredentials,
    verifyAdminCredentials
} from "../databse/admin-client";


dotenv.config();


export const registerAdmin = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password, phone, role } = req.body;
    console.log(req.body)

    const admin: Admin = { username, email, password, phone, role };

    // console.log("csc",req.body);

    try {
        let registration = await verifyAdminCredentials(admin.email);

        if (registration != null) {
            return res.status(401).json({ message: 'User already exists' });
        }

        // if (role === 'ADMIN' || role === 'ADMINISTRATIVE') {
        //     if (!req.header("Authorization")) {
        //         return res.status(401).json({ message: 'Unauthorized' });
        //     }
        // }

        // Encrypt the password before saving
        admin.password = await bcrypt.hash(admin.password, 10);

        // Create new admin
        const newAdmin = await createAdminUser(admin);

        return res.status(201).json({
            message: 'Admin registered successfully',
            admin: newAdmin,
        });

    } catch (err) {
        console.error("Error in registerAdmin:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
};


export const getAllAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const admins = await getAllAdmins();
        return res.status(200).json(admins);

    } catch (err) {
        console.error("Error in getAllAdmins:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}

export const getAdminById = async (req: Request, res: Response): Promise<any> => {
    const adminId = req.params.adminId;
    try {
        const admin = await isAdminCredentials(adminId);
        if (admin == null) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json(admin);
    } catch (err) {
        console.error("Error in getAdminById:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}


export const updateAdmin = async (req: Request, res: Response): Promise<any> => {
    console.log(req.body,"Heyyyyy");
    const adminId = req.params.adminId;
    const admin: Admin = req.body;
    try {
        const isAdmin = await isAdminCredentials(adminId);
        if (isAdmin == null) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const updatedAdmin = await adminUpdate(adminId, admin);
        return res.status(200).json(updatedAdmin);
    } catch (err) {
        console.error("Error in updateAdmin:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}


export const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
    const adminId = req.params.adminId;
    try {
        const isAdmin = await isAdminCredentials(adminId);
        if (isAdmin == null) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const deletedAdmin = await adminDelete(adminId);
        return res.status(200).json({
            message: 'Admin deleted successfully',
        });
    } catch (err) {
        console.error("Error in deleteAdmin:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}

















//this admin login
// export const adminLogin = async (req: Request, res: Response): Promise<any> => {
//     const {email , password} = req.body
//
//     try {
//
//         let isAdmin = await verifyAdminCredentials(email);
//         if (!isAdmin) {
//             return res
//                 .status(400)
//                 .json({ message: 'Invalid credentials' });
//         }
//
//         const isMatch = await bcrypt.compare(password, isAdmin.password)
//
//         if (!isMatch) {
//             return res
//                 .status(400)
//                 .json({ message: 'Invalid credentials' });
//         }
//
//         const accessToken = generateAccessToken(isAdmin.adminId,isAdmin.name,isAdmin.email, isAdmin.role,isAdmin.phone);
//         return res.status(200).json({
//             userId: isAdmin.adminId,
//             name: isAdmin.name,
//             email: isAdmin.email,
//             role: isAdmin.role,
//             token: accessToken,
//
//         });
//
//     }catch (err){
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// export const refreshToken = async (req: Request, res: Response): Promise<any> => {
//     const refreshToken = req.header("Authorization")?.replace("Bearer ", "");
//
//     if (!refreshToken) {
//         return res.status(401).json({ message: "No refresh token provided" });
//     }
//
//     try {
//         // Verify refresh token
//         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret) as { adminId: string, email: string, role: string };
//
//         // Generate new access token
//         const accessNewToken = jwt.sign(
//             { adminId: decoded.adminId, email: decoded.email, role: decoded.role },
//             process.env.JWT_SECRET as Secret,
//             { expiresIn: "2h" }
//         );
//
//         return res.status(200).json({ accessNewToken });
//
//     } catch (err) {
//         console.error("Error in refreshToken:", err);
//         return res.status(403).json({ message: "Invalid or expired refresh token" });
//     }
// };