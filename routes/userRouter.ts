import express from 'express';
// import{}from



const userRouter = express.Router();


userRouter.post('/customerRegister');
userRouter.post('/customerLogin');

userRouter.post('/adminRegister');
userRouter.post('/adminLogin');




export default userRouter;