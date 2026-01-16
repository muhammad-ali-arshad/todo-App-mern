import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';


dotenv.config();


const loginController = async (req , res) =>{
    try {
        const {email , password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"});
        }

        const user = await User.findOne({
            email:email
        })

        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isMatched = await bcrypt.compare(password , user.password);
        if(!isMatched){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const token =jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })


    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }
}

export default loginController;