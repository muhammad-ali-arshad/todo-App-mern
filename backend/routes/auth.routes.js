import express from 'express';
import loginController from '../controllers/login.controller.js';
import signController from '../controllers/sign.controller.js';
const authRouter = express.Router();
authRouter.post('/login' , loginController);
authRouter.post('/sign' , signController);

export default authRouter;