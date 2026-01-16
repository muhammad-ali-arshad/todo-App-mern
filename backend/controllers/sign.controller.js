import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const signController = async (req , res) => {

    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const existingUser = await User.findOne({email:email});

        if (existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(201).json({
            message:"User registered successfully",
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

export default signController;