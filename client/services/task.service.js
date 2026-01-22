import { apiRequest } from './api';

export const fetchTasks = async () => {
  // GET /api/tasks
  return await apiRequest('tasks', 'GET');
};

export const createTask = async (title, description = '', completed = false, dueDate = null) => {
  // POST /api/tasks
  const payload = { title, description, completed };
  if (dueDate) {
    payload.dueDate = dueDate;
  }
  console.log('[SERVICE] createTask payload:', payload, 'completed type:', typeof completed, 'dueDate:', dueDate);
  return await apiRequest('tasks', 'POST', payload);
};

export const updateTask = async (id, updates) => {
  // PUT /api/tasks/:id
  return await apiRequest(`tasks/${id}`, 'PUT', updates);
};

export const deleteTask = async (id) => {
  // DELETE /api/tasks/:id
  return await apiRequest(`tasks/${id}`, 'DELETE');
};

