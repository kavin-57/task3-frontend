import axios from 'axios';
import { Task, CreateTaskRequest, TaskExecution } from '../types/Task';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const taskService = {
    getTasks: async (id?: string): Promise<Task[]> => {
        const url = id ? `/tasks?id=${id}` : '/tasks';
        const response = await api.get(url);
        return Array.isArray(response.data) ? response.data : [response.data];
    },

    saveTask: async (task: CreateTaskRequest): Promise<Task> => {
        const response = await api.put('/tasks', task);
        return response.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    searchTasks: async (query: string): Promise<Task[]> => {
        const response = await api.get(`/tasks/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    executeTask: async (id: string): Promise<TaskExecution> => {
        const response = await api.put(`/tasks/${id}/run`);
        return response.data;
    },
};