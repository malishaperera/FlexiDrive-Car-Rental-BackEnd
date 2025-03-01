import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import {Request, Response} from "express";

dotenv.config();

export const generateAccessToken = (id: string,name:string ,email: string, role: string,phone:string) => {
    return jwt.sign(
        { id, name,email, role,phone },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "5h" }
    );
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
        return res.status(401).json(
            {
                message: "No refresh token provided"
            }
        );
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret) as { adminId: string, email: string, role: string };

        // Generate new access token
        const accessNewToken = jwt.sign(
            { adminId: decoded.adminId, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET as Secret,
            { expiresIn: "2h" }
        );

        return res.status(200).json({ accessNewToken });

    } catch (err) {
        console.error("Error in refreshToken:", err);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};