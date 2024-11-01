// src/pages/AddDiscussionPage.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddDiscussionPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await api.post('/proposals', { title, description });
            navigate(`/discussions/${response.data.id}`);
        } catch (error) {
            console.error("Ошибка при добавлении обсуждения:", error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Добавить обсуждение</Typography>
            <TextField
                label="Название"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Описание"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2 }}>
                Создать
            </Button>
        </Box>
    );
}

export default AddDiscussionPage;
