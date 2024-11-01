// src/pages/DiscussionsPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardContent, IconButton } from '@mui/material';
import { Add, ThumbUp, ThumbDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function DiscussionsPage() {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await api.get('/proposals');
                setDiscussions(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке обсуждений:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscussions();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">Обсуждения</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/discussions/add')}
                    sx={{ borderRadius: 3, textTransform: 'none', padding: '6px 16px' }}
                >
                    Добавить
                </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
                {discussions.map((discussion) => (
                    <Card
                        key={discussion.id}
                        onClick={() => navigate(`/discussions/${discussion.id}`)}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': { boxShadow: 6 },
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">
                                {discussion.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                                <IconButton disabled>
                                    <ThumbUp fontSize="small" color="primary" />
                                </IconButton>
                                <Typography variant="body2">{discussion.upvotes}</Typography>
                                <IconButton disabled>
                                    <ThumbDown fontSize="small" color="secondary" />
                                </IconButton>
                                <Typography variant="body2">{discussion.downvotes}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                                    {`${discussion.upvotes - discussion.downvotes} голосов`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default DiscussionsPage;
