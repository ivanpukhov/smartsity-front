// src/pages/EditProfilePage.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Chip, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function EditProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        bio: '',
        interests: []
    });
    const [allTags, setAllTags] = useState([]); // Все доступные интересы
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await api.get('/user/profile');
                const tagsResponse = await api.get('/tags'); // Получаем все теги (интересы) с сервера
                setProfile({
                    firstName: profileResponse.data.firstName,
                    lastName: profileResponse.data.lastName,
                    phone: profileResponse.data.phone,
                    bio: profileResponse.data.bio || '',
                    interests: profileResponse.data.interests || []
                });
                setAllTags(tagsResponse.data); // Устанавливаем список всех доступных тегов
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleInterestsChange = (event, newValue) => {
        setProfile((prevProfile) => ({ ...prevProfile, interests: newValue }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/user/profile', {
                ...profile,
                interests: profile.interests.map(interest => interest.name) // Передаем только названия интересов
            });
            navigate('/profile'); // Перенаправление на страницу профиля после сохранения
        } catch (error) {
            console.error("Ошибка при сохранении профиля:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>Редактировать профиль</Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Имя"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Фамилия"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Телефон"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Биография"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />
                <Autocomplete
                    multiple
                    options={allTags}
                    getOptionLabel={(option) => option.name}
                    value={profile.interests}
                    onChange={handleInterestsChange}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip key={index} label={option.name} {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Интересы" placeholder="Выберите интересы" />
                    )}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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

export default EditProfilePage;
