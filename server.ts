import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import AuthRouter from "./routes/auth.router";



dotenv.config();

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

declare module 'express' {
    interface Request {
        user?: any;
    }
}

// app.use((req: Request, res: Response, next: NextFunction) => {
//     let token = req.header("Authorization");
//
//     if (token) {
//         token = token.replace("Bearer ", "");
//         jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//             if (!err) {
//                 req.user = decoded;
//             }
//         });
//     }
//     next();
// });



app.use("/api/auth", AuthRouter)





app.listen(3003, () => {
    console.log("Server running on port 3003");
});