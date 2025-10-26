export interface User {
    username: string;
    email: string;
  }
  
  export interface AuthResponse {
    token: string;
    username: string;
    email: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
  }
  
  export interface Task {
    id: number;
    title: string;
    dueDate?: string;
    isCompleted: boolean;
    createdAt: string;
    projectId: number;
  }
  
  export interface Project {
    id: number;
    title: string;
    description?: string;
    createdAt: string;
    tasks: Task[];
  }
  
  export interface CreateProjectDto {
    title: string;
    description?: string;
  }
  
  export interface CreateTaskDto {
    title: string;
    dueDate?: string;
  }
  
  export interface UpdateTaskDto {
    title?: string;
    dueDate?: string;
    isCompleted?: boolean;
  }
  