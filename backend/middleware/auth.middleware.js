import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req , res ,next) =>{
    try {
        const token = req.header("Authorization").replace("Bearer ","");
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({_id:decode._id});
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message:"Unauthorized access"});
    }
}

export default authMiddleware;