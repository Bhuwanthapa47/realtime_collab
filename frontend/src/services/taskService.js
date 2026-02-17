import api from './api';

export const taskService = {
  getTasksByList: async (listId) => {
    const response = await api.get(`/tasks/list/${listId}`);
    return response.data;
  },

  createTask: async (title, description, listId) => {
    const response = await api.post('/tasks', { title, description, listId });
    return response.data;
  },

  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  },

  assignTask: async (taskId, userId) => {
    const response = await api.put(`/tasks/${taskId}/assign?userId=${userId}`);
    return response.data;
  },

  reorderTask: async (taskId, position) => {
    await api.put(`/tasks/${taskId}/reorder?position=${position}`);
  },

  moveTask: async (taskId, targetListId, position) => {
    const response = await api.put(`/tasks/${taskId}/move?targetListId=${targetListId}&position=${position}`);
    return response.data;
  },

  searchTasks: async (query) => {
    const response = await api.get(`/tasks/search?q=${query}`);
    return response.data;
  },

  getTasksPaged: async (listId, page, size) => {
    const response = await api.get(`/tasks/paged?listId=${listId}&page=${page}&size=${size}`);
    return response.data;
  },
};
