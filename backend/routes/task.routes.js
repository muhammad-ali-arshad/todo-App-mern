import express from 'express';
import authmiddleware from '../middleware/auth.middleware.js';

import addTaskController from '../controllers/addTask.controller.js';
import editTaskController from '../controllers/editTask.controller.js';
import deleteTaskController from '../controllers/removeTask.controller.js';

const taskRouter = express.Router();

taskRouter.post('/add' ,authmiddleware, addTaskController);
taskRouter.put('/edit/:taskId',authmiddleware, editTaskController);
taskRouter.delete('/delete/:taskId',authmiddleware, deleteTaskController);
export default taskRouter;