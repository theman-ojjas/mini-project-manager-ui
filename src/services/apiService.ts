import axios from 'axios';
import type{ Project, CreateProjectDto, CreateTaskDto, UpdateTaskDto, Task } from '../types';
import { authService } from './authService';

const API_URL = 'https://mini-project-manager-server-gihr.onrender.com/api';


const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  async getProject(id: number): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectDto): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  // Tasks
  async createTask(projectId: number, data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(taskId: number, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  }

};
