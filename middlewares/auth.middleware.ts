
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv, {config} from "dotenv";

dotenv.config();
export enum UserRole {
    ADMIN = "ADMIN",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    CUSTOMER = "CUSTOMER"
}

// interface AuthRequest extends Request {
//     user?: any;
// }

//Authentication Middleware (Protect Routes)
// export const authenticate = (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction) => {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//
//     if (!token) {
//         return res.status(401).json({ message: "Access Denied: No token provided" });
//     }
//
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: "Invalid or expired token" });
//     }
// };

// Authorization Middleware (Admin Only)
// export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user || req.user.role !== "ADMIN") {
//         return res.status(403).json({ message: "Access Denied: Admins only" });
//     }
//     next();
// };

// export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user || !["ADMIN", "ADMINISTRATIVE"].includes(req.user.role)) {
//         return res.status(403).json({ message: "Access Denied: Admins only" });
//     }
//     next();
// };


export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.ADMINISTRATIVE) {
        res.status(403).json({ message: "Access denied, admin privileges required." });
    }
    next();
};


export const authorizeCustomer = (req: Request, res: Response, next: NextFunction) :void=> {
    if (!req.user || req.user.role !== "CUSTOMER") {
        res.status(403).json({ message: "Access Denied: Customers only" });
    }
    next();
};

// export const authenticateUser = async (req: Request, res: Response, next: NextFunction)=>{
//     let token = req.header("Authorization")?.replace("Bearer ", "");
//
//     if (!token) {
//         return res.status(401).json({ message: "No token, authorization denied" });
//     }
//     token = token.replace("Bearer ", "");
//     jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//         if (!err) {
//             req.user = decoded;
//         }
//     });
//     next();
// }

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    token = token.replace("Bearer ", "");

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // This is now safe since we've extended the Request type
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};