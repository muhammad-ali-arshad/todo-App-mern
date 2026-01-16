import Task from '../models/tasks.model.js';

const removeTaskController = async (req , res) => {
    try {
        const {taskId} = req.params;
        const task = await Task.findOne({_id:taskId , user:req.user._id});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        await Task.deleteOne({_id:taskId});
        res.status(200).json({message:"Task removed successfully"});
    }  
    catch (error) {
        return res.status(500).json({message:"Server error"});
    }
}
export default removeTaskController;
