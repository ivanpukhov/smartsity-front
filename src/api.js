// src/api.js
import axios from 'axios';

const API_URL = 'https://nntnn.ru/api'; // Замените на URL вашего сервера

// Настраиваем базовый URL для всех запросов
const api = axios.create({
    baseURL: API_URL,
});

// Функция для установки токена в заголовок Authorization
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
