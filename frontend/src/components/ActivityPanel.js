import React, { useState, useEffect, useCallback } from 'react';
import { activityService } from '../services/activityService';
import './ActivityPanel.css';

const ActivityPanel = ({ boardId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = useCallback(async () => {
    try {
      const data = await activityService.getBoardActivities(boardId);
      setActivities(data);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK_CREATED': return '➕';
      case 'TASK_UPDATED': return '✏️';
      case 'TASK_DELETED': return '🗑️';
      case 'TASK_MOVED': return '↔️';
      case 'TASK_ASSIGNED': return '👤';
      case 'LIST_CREATED': return '📋';
      case 'LIST_UPDATED': return '✏️';
      case 'LIST_DELETED': return '🗑️';
      case 'BOARD_UPDATED': return '📝';
      default: return '•';
    }
  };

  if (loading) {
    return <div className="activity-panel">Loading activities...</div>;
  }

  return (
    <div className="activity-panel">
      <h3>Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="no-activities">No activities yet</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <span className="activity-icon">{getActivityIcon(activity.type)}</span>
              <div className="activity-content">
                <div className="activity-user">
                  {activity.user?.name || 'Unknown'}
                </div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">{formatTimestamp(activity.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityPanel;
