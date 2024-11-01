// src/components/EventItem.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Box, CardActionArea } from '@mui/material';
import { Favorite, FavoriteBorder, Star, StarBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../api';

function EventItem({ event }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [likesCount, setLikesCount] = useState(event.likes);

    // При загрузке компонента извлекаем состояние из localStorage и преобразуем в boolean
    useEffect(() => {
        const storedLike = localStorage.getItem(`event-${event.id}-liked`) === 'true';
        const storedFavorite = localStorage.getItem(`event-${event.id}-favorite`) === 'true';
        setIsLiked(storedLike);
        setIsFavorite(storedFavorite);
    }, [event.id]);

    // Обработчик лайка с сохранением в localStorage
    const handleLike = async () => {
        if (!isLiked) {
            await api.post(`/events/${event.id}/like`);
            setLikesCount(prev => prev + 1);
            setIsLiked(true);
            localStorage.setItem(`event-${event.id}-liked`, 'true'); // Сохраняем "true" как строку
        }
    };

    // Обработчик добавления в избранное с сохранением в localStorage
    const handleFavorite = async () => {
        await api.post(`/events/${event.id}/favorite`);
        setIsFavorite(!isFavorite);
        localStorage.setItem(`event-${event.id}-favorite`, (!isFavorite).toString()); // Сохраняем как строку
    };

    return (
        <Card sx={{ mb: 2, borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
            <CardActionArea component={Link} to={`/events/${event.id}`}>
                <CardContent sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: 14, mb: 1 }}>
                        {new Date(event.startDate).toLocaleDateString()} • {event.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {event.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <Box display="flex" alignItems="center" gap={1} p={2} sx={{ backgroundColor: '#fafafa' }}>
                <IconButton onClick={handleLike} disabled={isLiked}>
                    {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <Typography>{likesCount}</Typography>
                <IconButton onClick={handleFavorite}>
                    {isFavorite ? <Star color="primary" /> : <StarBorder />}
                </IconButton>
            </Box>
        </Card>
    );
}

export default EventItem;
