// src/pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import EventList from '../components/EventList';
import api from '../api';
import { Add, QrCode } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import QrScanner from 'react-qr-scanner';

function EventsPage() {
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isAllEvents, setIsAllEvents] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            const profileResponse = await api.get('/user/profile');
            setTags(profileResponse.data.interests);
        };
        fetchTags();
    }, []);

    const handleScan = (data) => {
        if (data) {
            console.log("QR Code Scanned:", data); // Для отладки
            try {
                const url = new URL(data);
                if (url.searchParams.get('addToFavorite') === 'true') {
                    const eventId = url.pathname.split('/').pop();
                    addToFavorites(eventId);
                    setQrOpen(false);
                    navigate(`/events/${eventId}`);
                } else {
                    console.warn("QR Code не содержит параметра addToFavorite=true");
                }
            } catch (error) {
                console.error("Недопустимый URL в QR-коде:", data);
            }
        }
    };

    const handleError = (err) => {
        console.error("Ошибка при сканировании QR-кода:", err);
    };

    const addToFavorites = async (eventId) => {
        try {
            await api.post(`/events/${eventId}/favorite`);
            localStorage.setItem(`event-${eventId}-favorite`, 'true');
        } catch (error) {
            console.error("Ошибка при добавлении в избранное:", error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Мероприятия</Typography>
                <Box>
                    <IconButton onClick={() => setQrOpen(true)} sx={{ mr: 1 }}>
                        <QrCode />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/events/add')}
                        sx={{ borderRadius: 50, textTransform: 'none' }}
                    ></Button>
                </Box>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {tags.map((tag) => (
                    <Chip
                        key={tag.name}
                        label={tag.name}
                        clickable
                        color={selectedTag === tag.name ? 'primary' : 'default'}
                        onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    />
                ))}
            </Box>
            <EventList selectedTag={selectedTag} isAllEvents={isAllEvents} />
            {!isAllEvents && (
                <Button onClick={() => setIsAllEvents(true)} variant="outlined" sx={{ mt: 2 }}>
                    Показать все мероприятия
                </Button>
            )}

            {/* Диалог для QR-сканера */}
            <Dialog open={qrOpen} onClose={() => setQrOpen(false)}>
                <DialogTitle>Сканировать QR-код для добавления в избранное</DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '300px' }}
                    />
                </DialogContent>
                <Button onClick={() => setQrOpen(false)} color="primary" sx={{ m: 2 }}>
                    Закрыть
                </Button>
            </Dialog>
        </Box>
    );
}

export default EventsPage;
