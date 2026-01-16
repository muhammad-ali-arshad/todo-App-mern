import Task from '../models/tasks.model.js';

const addTaskController = async (req , res) => {
    try {
        const {title , description , dueDate} = req.body;
        if(!title || !dueDate){
            return res.status(400).json({message:"Title and Due Date are required"});
        }
        const task = new Task({
            title,
            description,
            dueDate,
            user:req.user._id
        });
        await task.save();
        res.status(201).json({message:"Task added successfully", task});
    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }
}

export default addTaskController;