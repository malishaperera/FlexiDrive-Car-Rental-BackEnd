
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
    user?: any;
}

// ✅ Authentication Middleware (Protect Routes)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// ✅ Authorization Middleware (Admin Only)
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access Denied: Admins only" });
    }
    next();
};

// ✅ Authorization Middleware (Customer Only)
export const authorizeCustomer = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "CUSTOMER") {
        return res.status(403).json({ message: "Access Denied: Customers only" });
    }
    next();
};
