import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onUpdate, onAssign, onDragStart }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleUpdate = () => {
    if (editedTitle.trim() && (editedTitle !== task.title || editedDescription !== task.description)) {
      onUpdate(task.id, {
        title: editedTitle,
        description: editedDescription,
      });
    }
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    const statusCycle = { 'PENDING': 'IN_PROGRESS', 'IN_PROGRESS': 'COMPLETED', 'COMPLETED': 'PENDING' };
    const newStatus = statusCycle[task.status] || 'IN_PROGRESS';
    onUpdate(task.id, { status: newStatus });
  };

  const handleAssignUser = (userId) => {
    onAssign(task.id, userId);
    setShowAssignMenu(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceListId', task.list.id);
    if (onDragStart) onDragStart(task);
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="edit-title-input"
          autoFocus
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="edit-description-input"
          rows="3"
          placeholder="Description..."
        />
        <div className="edit-actions">
          <button className="btn btn-primary btn-sm" onClick={handleUpdate}>
            Save
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`task-card ${task.status === 'COMPLETED' ? 'completed' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-content" onClick={() => setIsEditing(true)}>
        <h4>{task.title}</h4>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`status-badge ${(task.status || 'PENDING').toLowerCase()}`}>
            {task.status || 'PENDING'}
          </span>
          {task.assignedTo && <span className="assigned-to">@{task.assignedTo.name}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={handleStatusToggle}
          title="Change status"
        >
          {task.status === 'COMPLETED' ? '↩️' : task.status === 'IN_PROGRESS' ? '⏩' : '▶️'}
        </button>
        <div className="assign-dropdown">
          <button 
            className="btn-icon" 
            onClick={() => setShowAssignMenu(!showAssignMenu)}
            title="Assign user"
          >
            👤
          </button>
          {showAssignMenu && (
            <div className="assign-menu">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className="assign-option"
                  onClick={() => handleAssignUser(user.id)}
                >
                  {user.name} {task.assignedTo?.id === user.id && '✓'}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn-icon" onClick={() => onDelete(task.id)} title="Delete task">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
