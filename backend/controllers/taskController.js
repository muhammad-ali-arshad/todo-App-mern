const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  // Log incoming request body and completed value
  console.log('[CONTROLLER] req.body:', req.body);
  console.log('[CONTROLLER] req.body.completed:', req.body.completed, 'type:', typeof req.body.completed);
  console.log('[CONTROLLER] req.body.dueDate:', req.body.dueDate, 'type:', typeof req.body.dueDate);
  
  const { title, description, completed, dueDate } = req.body;
  
  // Log extracted values
  console.log('[CONTROLLER] Extracted - completed:', completed, 'type:', typeof completed);
  console.log('[CONTROLLER] Extracted - dueDate:', dueDate, 'type:', typeof dueDate);
  
  try {
    // Pass completed and dueDate to Task model (preserve false values)
    const taskData = { title, description, user: req.user.id };
    if (completed !== undefined) {
      taskData.completed = completed;
    }
    if (dueDate !== undefined && dueDate !== null) {
      taskData.dueDate = dueDate;
    }
    console.log('[CONTROLLER] Task data being created:', taskData);
    
    const task = new Task(taskData);
    console.log('[CONTROLLER] Task before save - completed:', task.completed, 'type:', typeof task.completed);
    console.log('[CONTROLLER] Task before save - dueDate:', task.dueDate, 'type:', typeof task.dueDate);
    
    await task.save();
    
    console.log('[CONTROLLER] Task after save - completed:', task.completed, 'type:', typeof task.completed);
    console.log('[CONTROLLER] Task after save - dueDate:', task.dueDate, 'type:', typeof task.dueDate);
    res.json(task);
  } catch (error) {
    console.error('[CONTROLLER] Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, completed, dueDate } = req.body;
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    
    task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Task.findByIdAndRemove(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};