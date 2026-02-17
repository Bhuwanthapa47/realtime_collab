import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import TaskCard from './TaskCard';
import './TaskListComponent.css';

const TaskListComponent = ({ list, onDelete, onUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(list.name);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasksByList(list.id);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, [list.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleUpdateName = () => {
    if (editedName.trim() && editedName !== list.name) {
      onUpdate(list.id, editedName);
    }
    setIsEditing(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const newTask = await taskService.createTask(newTaskTitle, newTaskDescription, list.id);
      setTasks([...tasks, newTask]);
      setShowAddTask(false);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleAssignTask = async (taskId, userId) => {
    try {
      const updatedTask = await taskService.assignTask(taskId, userId);
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
    } catch (err) {
      console.error('Failed to assign task:', err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceListId = parseInt(e.dataTransfer.getData('sourceListId'));
    
    if (sourceListId === list.id) {
      // Reorder within same list
      return;
    }
    
    try {
      const position = tasks.length;
      await taskService.moveTask(taskId, list.id, position);
      await loadTasks();
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  return (
    <div 
      className={`task-list ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="task-list-header">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleUpdateName}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
            autoFocus
            className="list-name-input"
          />
        ) : (
          <h3 onClick={() => setIsEditing(true)}>{list.name}</h3>
        )}
        <button className="btn-icon" onClick={() => onDelete(list.id)} title="Delete list">
          🗑️
        </button>
      </div>

      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={handleDeleteTask} 
            onUpdate={handleUpdateTask}
            onAssign={handleAssignTask}
          />
        ))}
      </div>

      {showAddTask ? (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
            required
            autoFocus
            className="task-input"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Description (optional)"
            rows="2"
            className="task-textarea"
          />
          <div className="add-task-actions">
            <button type="submit" className="btn btn-primary btn-sm">
              Add Task
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddTask(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn-add-task" onClick={() => setShowAddTask(true)}>
          + Add Task
        </button>
      )}
    </div>
  );
};

export default TaskListComponent;
