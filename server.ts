import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import AuthRouter from "./routes/admin.router";
import UserRouter from "./routes/customerRouter";
import CarRouter from "./routes/carRouter";
import CarBookingRouter from "./routes/carBookingRouter";
import LoginRouter from "./routes/login.router";
import CustomerRouter from "./routes/customerRouter";
import AdminRouter from "./routes/admin.router";

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


dotenv.config();

const app = express();

app.use(express.json());

// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//         credentials: true,
//     })
// );

app.use(
    cors({
        origin: true,  // Allow any origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    })
);


declare module 'express' {
    interface Request {
        user?: any;
    }
}
app.use("/api/auth/login",LoginRouter)
app.use("/api/auth/admin", AdminRouter)
app.use("/api/customer", CustomerRouter)
app.use("/api/car",CarRouter)
app.use("/api/booking",CarBookingRouter)
// app.use("/api/booking",CarBookingPaymentRouter)


app.listen(3003, () => {
    console.log("Server running on port 3003");
});