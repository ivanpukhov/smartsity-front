// src/pages/DirectoryServicePage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Card, CardContent, List, ListItem, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Add, Call } from '@mui/icons-material';
import api from '../api';

function DirectoryServicePage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false); // Управление диалогом добавления службы
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        location: '',
        phone: '',
        workingHours: ''
    });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/directory');
                setServices(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке служб:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewService({
            name: '',
            description: '',
            location: '',
            phone: '',
            workingHours: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewService((prevService) => ({ ...prevService, [name]: value }));
    };

    const handleAddService = async () => {
        setAdding(true);
        try {
            const response = await api.post('/directory', newService);
            setServices([...services, response.data]);
            handleClose();
        } catch (error) {
            console.error("Ошибка при добавлении службы:", error);
        } finally {
            setAdding(false);
        }
    };

    const handleCall = (phone) => {
        window.open(`tel:${phone}`, '_self');
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Справочная служба</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
                    sx={{ borderRadius: 50, textTransform: 'none',  }}
                >
                </Button>
            </Box>

            {/* Диалог для добавления новой службы */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить новую службу</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название"
                        name="name"
                        value={newService.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Описание"
                        name="description"
                        value={newService.description}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Локация"
                        name="location"
                        value={newService.location}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Телефон"
                        name="phone"
                        value={newService.phone}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Часы работы"
                        name="workingHours"
                        value={newService.workingHours}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleAddService} variant="contained" disabled={adding}>
                        {adding ? 'Добавление...' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Список служб с кнопкой "Позвонить" */}
            <Box>
                <Typography variant="h6" gutterBottom>Список служб</Typography>
                {services.length === 0 ? (
                    <Typography color="textSecondary">Службы отсутствуют.</Typography>
                ) : (
                    <List>
                        {services.map((service) => (
                            <ListItem key={service.id}>
                                <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 1 }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="h6">{service.name}</Typography>
                                                <Typography color="textSecondary">{service.description}</Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    Локация: {service.location}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Часы работы: {service.workingHours}
                                                </Typography>
                                            </Box>
                                            <IconButton onClick={() => handleCall(service.phone)} color="primary">
                                                <Call />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Телефон: {service.phone}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
}

export default DirectoryServicePage;
