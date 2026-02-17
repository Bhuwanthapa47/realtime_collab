import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../services/boardService';
import { taskListService } from '../services/taskListService';
import { taskService } from '../services/taskService';
import websocketService from '../services/websocketService';
import TaskListComponent from './TaskListComponent';
import ActivityPanel from './ActivityPanel';
import './BoardDetail.css';

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const loadBoardData = useCallback(async () => {
    try {
      const [boardData, listsData] = await Promise.all([
        boardService.getBoardById(boardId),
        taskListService.getTaskListsByBoard(boardId),
      ]);
      setBoard(boardData);
      setTaskLists(listsData);
    } catch (err) {
      setError('Failed to load board data');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const handleWebSocketMessage = useCallback((data) => {
    console.log('WebSocket message received:', data);
    // Reload data when changes occur
    loadBoardData();
  }, [loadBoardData]);

  useEffect(() => {
    loadBoardData();
    
    // Connect WebSocket and subscribe to board updates
    const setupWebSocket = async () => {
      try {
        await websocketService.connect();
        websocketService.subscribeToBoard(boardId, handleWebSocketMessage);
      } catch (error) {
        console.error('WebSocket setup failed:', error);
      }
    };
    
    setupWebSocket();

    return () => {
      websocketService.unsubscribe(`board-${boardId}`);
    };
  }, [boardId, loadBoardData, handleWebSocketMessage]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newList = await taskListService.createTaskList(newListName, boardId);
      setTaskLists([...taskLists, newList]);
      setShowCreateListModal(false);
      setNewListName('');
    } catch (err) {
      setError('Failed to create list');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;

    try {
      await taskListService.deleteTaskList(listId);
      setTaskLists(taskLists.filter((list) => list.id !== listId));
    } catch (err) {
      setError('Failed to delete list');
    }
  };

  const handleUpdateList = async (listId, newName) => {
    try {
      await taskListService.updateTaskList(listId, newName);
      setTaskLists(taskLists.map((list) => (list.id === listId ? { ...list, name: newName } : list)));
    } catch (err) {
      setError('Failed to update list');
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await taskService.searchTasks(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (loading) {
    return <div className="loading">Loading board...</div>;
  }

  if (!board) {
    return <div className="error">Board not found</div>;
  }

  return (
    <div className="board-detail-container">
      <header className="board-header">
        <div className="board-header-content">
          <button className="btn-back" onClick={() => navigate('/boards')}>
            ← Back to Boards
          </button>
          <div className="board-info">
            <h1>{board.name}</h1>
            {board.description && <p>{board.description}</p>}
          </div>
          <div className="board-search">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showSearchResults && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          {searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((task) => (
                <div key={task.id} className="search-result-item">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <span className="result-list">List: {task.list.name}</span>
                  <span className={`status-badge ${(task.status || 'PENDING').toLowerCase()}`}>
                    {task.status || 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No tasks found matching "{searchQuery}"</p>
          )}
        </div>
      )}

      <div className="board-content">
        <div className="board-main-content">
          <div className="task-lists-container">
            {taskLists.map((list) => (
              <TaskListComponent
                key={list.id}
                list={list}
                onDelete={handleDeleteList}
                onUpdate={handleUpdateList}
              />
            ))}

            <div className="task-list create-list-card" onClick={() => setShowCreateListModal(true)}>
              <div className="create-list-content">
                <span className="plus-icon">+</span>
                <p>Add List</p>
              </div>
            </div>
          </div>

          <div className="activity-sidebar">
            <ActivityPanel boardId={boardId} />
          </div>
        </div>
      </div>

      {showCreateListModal && (
        <div className="modal-overlay" onClick={() => setShowCreateListModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New List</h2>
              <button className="close-btn" onClick={() => setShowCreateListModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateList}>
              <div className="form-group">
                <label htmlFor="listName">List Name</label>
                <input
                  type="text"
                  id="listName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                  placeholder="Enter list name"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateListModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
