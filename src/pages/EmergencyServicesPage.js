// src/pages/EmergencyServicesPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, Card, CardContent, IconButton } from '@mui/material';
import { Add, Phone } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function EmergencyServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/emergency-services');
                setServices(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке экстренных служб:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleEmergencyCall = () => {
        window.open('tel:112', '_self');
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Экстренные службы</Typography>
                <Button
                    variant="contained"
                    startIcon={<Phone />}
                    onClick={handleEmergencyCall}
                    sx={{ backgroundColor: 'red', color: 'white', borderRadius: 2, textTransform: 'none' }}
                >
                    Вызвать 112
                </Button>
            </Box>

            <List>
                {services.map((service) => (
                    <ListItem key={service.id}>
                        <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6">{service.name}</Typography>
                                        <Typography color="textSecondary">Телефон: {service.phoneNumber}</Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => navigate(`/emergency-services/${service.phoneNumber}/add-request`)}
                                        startIcon={<Add />}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Обратиться
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default EmergencyServicesPage;
