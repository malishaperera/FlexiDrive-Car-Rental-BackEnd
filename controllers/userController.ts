
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { console } from 'inspector';

dotenv.config();



export async function login(req: any, res: any) {
    console.log('login');
    const username = req.body.username;
    const password = req.body.password;

    const user:User = {username,password};

    


}











