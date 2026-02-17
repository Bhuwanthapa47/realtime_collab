import api from './api';

export const boardService = {
  getAllBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  getBoardById: async (boardId) => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  createBoard: async (name, description) => {
    const response = await api.post('/boards', { name, description });
    return response.data;
  },

  updateBoard: async (boardId, name, description) => {
    const response = await api.put(`/boards/${boardId}`, { name, description });
    return response.data;
  },

  deleteBoard: async (boardId) => {
    await api.delete(`/boards/${boardId}`);
  },
};
