import express from 'express';
// import authRoutes, {authenticateToken} from "./routes/auth-routes";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));



app.listen(3003,()=>{
    console.log("Server running on port 3003");
})