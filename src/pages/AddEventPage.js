// src/pages/AddEventPage.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddEventPage() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        tags: [],
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await api.post('/events', eventData);
            navigate(`/events/${response.data.id}`);
        } catch (error) {
            console.error("Ошибка при создании мероприятия:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>Добавить мероприятие</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Название"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />
                <TextField
                    label="Локация"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Дата начала"
                    name="startDate"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={eventData.startDate}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Дата окончания"
                    name="endDate"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={eventData.endDate}
                    onChange={handleChange}
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </Box>
        </Box>
    );
}

export default AddEventPage;
