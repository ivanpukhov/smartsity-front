// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api';

function AdminPage() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/emergency-services');
                setServices(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке служб:", error);
            }
        };
        fetchServices();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>Админ Панель</Typography>

            <Typography variant="h6" mb={2}>Список экстренных служб</Typography>
            <List>
                {services.map((service) => (
                    <ListItem key={service.phoneNumber}>
                        <ListItemText primary={service.name} />
                        <Button component={Link} to={`/emergency-services/${service.phoneNumber}/requests`} variant="contained" color="primary">
                            Просмотреть обращения
                        </Button>
                    </ListItem>
                ))}
            </List>

            <Button component={Link} to="/send-emergency-alert" variant="contained" color="secondary" sx={{ mt: 2 }}>
                Отправить экстренное сообщение
            </Button>
        </Box>
    );
}

export default AdminPage;
