import api from './api';

export const activityService = {
  getBoardActivities: async (boardId) => {
    const response = await api.get(`/activities/board/${boardId}`);
    return response.data;
  },
};
