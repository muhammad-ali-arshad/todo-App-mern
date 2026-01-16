import mongoose from "mongoose";


const Task = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            default:"",
            trim:true
        },
        currentStatus:{
            type:String,
            enum:["pending","in-progress","completed"],
            default:"pending"
        },
        dueDate:{
            type:Date
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.model("Task",Task);