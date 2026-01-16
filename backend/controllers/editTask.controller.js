import Task from '../models/tasks.model.js';

const editTaskController = async (req , res) => {
    try {
        const {taskId} = req.params;
        const {title , description , dueDate , status} = req.body;
        const task = await Task.findOne({_id:taskId , user:req.user._id});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(title) task.title = title;
        if(description) task.description = description;
        if(dueDate) task.dueDate = dueDate;
        if(status) task.currentStatus = status;
        await task.save();
        res.status(200).json({message:"Task updated successfully", task});
    }
    catch (error) {
        return res.status(500).json({message:"Server error"});
    }

}
export default editTaskController;