// src/pages/AuthPage.js
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Chip } from '@mui/material';
import InputMask from 'react-input-mask';
import api, { setAuthToken } from '../api';

function AuthPage({ setIsAuthenticated }) {
    const [authType, setAuthType] = useState(null); // 'login' или 'register'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        interests: []
    });
    const [availableInterests, setAvailableInterests] = useState([]); // Интересы с сервера

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await api.get('/tags'); // Запрос к серверу для получения интересов
                setAvailableInterests(response.data.map(tag => tag.name));
            } catch (error) {
                console.error("Ошибка загрузки интересов:", error);
            }
        };
        fetchInterests();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const toggleInterest = (interest) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            interests: prevFormData.interests.includes(interest)
                ? prevFormData.interests.filter(i => i !== interest)
                : [...prevFormData.interests, interest]
        }));
    };

    const handleAuth = async () => {
        try {
            const endpoint = authType === 'login' ? '/auth/login' : '/auth/register';
            const sanitizedData = { ...formData,             phone: formData.phone.replace(/\D/g, '').slice(1)   }; // Убираем все нечисловые символы из номера телефона
            const response = await api.post(endpoint, sanitizedData);
            const { token } = response.data;
            setAuthToken(token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            alert('Ошибка при авторизации. Пожалуйста, попробуйте снова.');
        }
    };

    return (
        <Paper
            elevation={6}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: 4,
                borderRadius: 3,
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Добро пожаловать в Smart City
            </Typography>
            {!authType ? (
                <Box display="flex" gap={2} mt={2}>
                    <Button
                        variant="contained"
                        onClick={() => setAuthType('login')}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 4,
                        }}
                    >
                        Вход
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setAuthType('register')}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 4,
                        }}
                    >
                        Регистрация
                    </Button>
                </Box>
            ) : (
                <Box width="100%" maxWidth="400px" mt={3}>
                    {authType === 'register' && (
                        <>
                            <TextField
                                label="Имя"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                            />
                            <TextField
                                label="Фамилия"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                            />
                            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                Выберите интересы:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                {availableInterests.map((interest) => (
                                    <Chip
                                        key={interest}
                                        label={interest}
                                        clickable
                                        color={formData.interests.includes(interest) ? 'primary' : 'default'}
                                        onClick={() => toggleInterest(interest)}
                                        sx={{ borderRadius: 1 }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                    <InputMask
                        mask="+7 999 999 99 99"
                        value={formData.phone}
                        onChange={handleChange}
                    >
                        {() => (
                            <TextField
                                label="Телефон"
                                name="phone"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                            />
                        )}
                    </InputMask>
                    <TextField
                        label="Пароль"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAuth}
                        fullWidth
                        sx={{
                            mt: 3,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                    >
                        {authType === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <Button onClick={() => setAuthType(null)} fullWidth sx={{ mt: 2, textTransform: 'none', color: '#1976d2' }}>
                        Назад
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

export default AuthPage;
