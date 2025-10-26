import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type{ Project, Task } from '../types';
import './ProjectDetails.css';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await apiService.getProject(Number(id));
      setProject(data);
    } catch (err) {
      console.error('Failed to load project', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !project) return;

    setLoading(true);
    try {
      await apiService.createTask(project.id, {
        title: taskTitle,
        dueDate: dueDate || undefined,
      });
      setShowModal(false);
      setTaskTitle('');
      setDueDate('');
      loadProject();
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await apiService.updateTask(task.id, {
        isCompleted: !task.isCompleted,
      });
      loadProject();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await apiService.deleteTask(taskId);
      loadProject();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-details">
      <header className="project-header">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          ← Back
        </button>
        <div>
          <h1>{project.title}</h1>
          <p>{project.description || 'No description'}</p>
        </div>
      </header>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Add Task
          </button>
        </div>

        <div className="tasks-list">
          {project.tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleTask(task)}
              />
              <div className="task-content">
                <h4>{task.title}</h4>
                {task.dueDate && (
                  <span className="task-due">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {project.tasks.length === 0 && (
          <div className="empty-state">
            <p>No tasks yet. Add your first task!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
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