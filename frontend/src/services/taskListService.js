import api from './api';

export const taskListService = {
  getTaskListsByBoard: async (boardId) => {
    const response = await api.get(`/task-lists/board/${boardId}`);
    return response.data;
  },

  createTaskList: async (name, boardId) => {
    const response = await api.post('/task-lists', { name, boardId });
    return response.data;
  },

  updateTaskList: async (listId, name) => {
    const response = await api.put(`/task-lists/${listId}`, { name });
    return response.data;
  },

  deleteTaskList: async (listId) => {
    await api.delete(`/task-lists/${listId}`);
  },
};
