import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardService } from '../services/boardService';
import { authService } from '../services/authService';
import './BoardList.css';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await boardService.getAllBoards();
      setBoards(data);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newBoard = await boardService.createBoard(newBoardName, newBoardDescription);
      setBoards([...boards, newBoard]);
      setShowCreateModal(false);
      setNewBoardName('');
      setNewBoardDescription('');
    } catch (err) {
      setError('Failed to create board');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;

    try {
      await boardService.deleteBoard(boardId);
      setBoards(boards.filter((b) => b.id !== boardId));
    } catch (err) {
      setError('Failed to delete board');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  return (
    <div className="board-list-container">
      <header className="header">
        <div className="header-content">
          <h1>My Boards</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {currentUser?.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="content">
        {error && <div className="error-message">{error}</div>}

        <div className="boards-grid">
          <div className="board-card create-board-card" onClick={() => setShowCreateModal(true)}>
            <div className="create-board-content">
              <span className="plus-icon">+</span>
              <p>Create New Board</p>
            </div>
          </div>

          {boards.map((board) => (
            <div key={board.id} className="board-card" onClick={() => navigate(`/boards/${board.id}`)}>
              <div className="board-card-content">
                <h3>{board.name}</h3>
                <p>{board.description || 'No description'}</p>
              </div>
              <div className="board-card-footer">
                <small>Created by {board.createdBy?.username}</small>
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}
                  title="Delete board"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Board</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateBoard}>
              <div className="form-group">
                <label htmlFor="boardName">Board Name</label>
                <input
                  type="text"
                  id="boardName"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  required
                  placeholder="Enter board name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="boardDescription">Description (optional)</label>
                <textarea
                  id="boardDescription"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Enter board description"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;
