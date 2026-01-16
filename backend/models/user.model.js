import mongoose from "mongoose";


const User = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        }
    },
    {
        timestamps:true
    }
)


export default mongoose.model("User",User);