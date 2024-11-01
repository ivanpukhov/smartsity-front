// src/pages/AddEmergencyRequestPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import api from '../api';

function AddEmergencyRequestPage() {
    const { phoneNumber } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState('');
    const [saving, setSaving] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation(`${latitude}, ${longitude}`);
                }, (error) => {
                    console.error("Ошибка при получении местоположения:", error);
                });
            } else {
                console.error("Geolocation не поддерживается данным браузером.");
            }
        };

        getLocation();
    }, []);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            // Отправляем реальное местоположение пользователя
            await api.post(`/emergency-services/${phoneNumber}/request`, { message, location: userLocation });
            navigate('/emergency-services/requests');
        } catch (error) {
            console.error("Ошибка при отправке обращения:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>Добавить обращение</Typography>
            <TextField
                label="Сообщение"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Местоположение"
                value={userLocation || 'Определение местоположения...'}
                disabled
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving}
                sx={{ borderRadius: 2 }}
            >
                {saving ? 'Отправка...' : 'Отправить'}
            </Button>
        </Box>
    );
}

export default AddEmergencyRequestPage;
