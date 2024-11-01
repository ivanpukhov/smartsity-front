// src/pages/EventDetail.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Card, CardContent, Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { Favorite, FavoriteBorder, Star, StarBorder, QrCode } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../api';
import CommentSection from '../components/CommentSection';

function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const qrRef = useRef();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);

                const storedLike = localStorage.getItem(`event-${id}-liked`) === 'true';
                const storedFavorite = localStorage.getItem(`event-${id}-favorite`) === 'true';
                setIsLiked(storedLike);
                setIsFavorite(storedFavorite);
            } catch (error) {
                console.error("Ошибка при загрузке мероприятия:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleLike = async () => {
        if (!isLiked) {
            try {
                await api.post(`/events/${id}/like`);
                setEvent(prevEvent => ({ ...prevEvent, likes: prevEvent.likes + 1 }));
                setIsLiked(true);
                localStorage.setItem(`event-${id}-liked`, 'true');
            } catch (error) {
                console.error("Ошибка при добавлении лайка:", error);
            }
        }
    };

    const handleFavorite = async () => {
        try {
            await api.post(`/events/${id}/favorite`);
            setIsFavorite(!isFavorite);
            localStorage.setItem(`event-${id}-favorite`, (!isFavorite).toString());
        } catch (error) {
            console.error("Ошибка добавления в избранное:", error);
        }
    };

    const handleQrOpen = () => setQrOpen(true);
    const handleQrClose = () => setQrOpen(false);

    const downloadQRCode = () => {
        const canvas = qrRef.current.querySelector("canvas");
        const qrImage = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = qrImage;
        downloadLink.download = `event-${id}-qr.png`;
        downloadLink.click();
    };

    if (loading) return <CircularProgress />;

    if (!event) return <Typography variant="h6">Мероприятие не найдено.</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{event.title}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: 14, mb: 1 }}>
                        {new Date(event.startDate).toLocaleDateString()} • {event.location}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
                        {event.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton onClick={handleLike} disabled={isLiked}>
                            {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography>{event.likes}</Typography>
                        <IconButton onClick={handleFavorite}>
                            {isFavorite ? <Star color="primary" /> : <StarBorder />}
                        </IconButton>
                        <Button variant="outlined" startIcon={<QrCode />} onClick={handleQrOpen} sx={{ ml: 2 }}>
                            QR-код                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Секция комментариев */}
            <CommentSection eventId={id} />

            {/* Модальное окно с QR-кодом */}
            <Dialog open={qrOpen} onClose={handleQrClose}>
                <DialogTitle>QR-код для добавления в избранное</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }} ref={qrRef}>
                    <QRCodeCanvas value={`${window.location.origin}/events/${id}?addToFavorite=true`} size={200} />
                    <Button onClick={downloadQRCode} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Скачать QR-код
                    </Button>
                </DialogContent>
                <Button onClick={handleQrClose} color="primary" sx={{ mb: 2 }}>Закрыть</Button>
            </Dialog>
        </Box>
    );
}

export default EventDetail;
