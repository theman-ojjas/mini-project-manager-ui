import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import type{ Project } from '../types';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      await apiService.createProject({ title, description });
      setShowModal(false);
      setTitle('');
      setDescription('');
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;

    try {
      await apiService.deleteProject(id);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Projects</h1>
        <div className="header-actions">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + New Project
        </button>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3 onClick={() => navigate(`/projects/${project.id}`)}>
                {project.title}
              </h3>
              <p>{project.description || 'No description'}</p>
              <div className="project-meta">
                <span>{project.tasks.length} tasks</span>
                <span>
                  {project.tasks.filter(t => t.isCompleted).length} completed
                </span>
              </div>
              <div className="project-actions">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="btn btn-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project title"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={4}
                  disabled={loading}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};