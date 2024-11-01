// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, Chip, CircularProgress, Card, CardContent, List, ListItem } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import api from '../api';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" flexDirection={"column"} gap={'24px'} alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Личный кабинет</Typography>
                <Button
                    component={Link}
                    to="/profile/edit"
                    variant="contained"
                    startIcon={<Edit />}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Редактировать
                </Button>
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ width: 64, height: 64 }}>{profile.firstName[0]}{profile.lastName[0]}</Avatar>
                <Box>
                    <Typography variant="h6">{profile.firstName} {profile.lastName}</Typography>
                    <Typography color="textSecondary">Телефон: {profile.phone}</Typography>
                    <Typography color="textSecondary">Баллы: {profile.points}</Typography>
                </Box>
            </Box>

            <Box mb={3}>
                <Typography variant="h6" gutterBottom>Обо мне</Typography>
                <Typography variant="body1">{profile.bio || "Информация отсутствует"}</Typography>
            </Box>

            <Box mb={3}>
                <Typography variant="h6" gutterBottom>Интересы</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {profile.interests.map((interest, index) => (
                        <Chip key={index} label={interest.name} color="primary" />
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>Избранные мероприятия</Typography>
                {profile.favorites.length === 0 ? (
                    <Typography color="textSecondary">Нет избранных мероприятий.</Typography>
                ) : (
                    <List>
                        {profile.favorites.map((event) => (
                            <ListItem
                                key={event.id}
                                component={Link}
                                to={`/events/${event.id}`}
                                sx={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 1 }}>
                                    <CardContent>
                                        <Typography variant="h6">{event.title}</Typography>
                                        <Typography color="textSecondary">
                                            {new Date(event.startDate).toLocaleDateString()} - {event.location}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>{event.description}</Typography>
                                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                            Лайков: {event.likes}
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

export default ProfilePage;
