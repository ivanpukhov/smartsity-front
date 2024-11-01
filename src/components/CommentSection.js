// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, Paper } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import SendIcon from '@mui/icons-material/Send';
import api from '../api';

function CommentSection({ eventId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [userProfile, setUserProfile] = useState(null); // Данные профиля пользователя

    useEffect(() => {
        const fetchCommentsAndProfile = async () => {
            try {
                const [commentsResponse, profileResponse] = await Promise.all([
                    api.get(`/events/${eventId}`),
                    api.get('/user/profile')
                ]);
                setComments(commentsResponse.data.comments || []);
                setUserProfile(profileResponse.data); // Сохраняем профиль пользователя
            } catch (error) {
                console.error("Ошибка при загрузке комментариев или профиля:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommentsAndProfile();
    }, [eventId]);

    const handleCommentSubmit = async () => {
        try {
            const response = await api.post(`/events/${eventId}/comment`, { content: newComment });
            const { content, createdAt } = response.data;
            setComments([
                ...comments,
                {
                    content,
                    createdAt,
                    author: {
                        firstName: userProfile.firstName,
                        lastName: userProfile.lastName
                    }
                }
            ]);
            setNewComment('');
        } catch (error) {
            console.error("Ошибка при добавлении комментария:", error);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Комментарии</Typography>
            <List sx={{ mb: 2 }}>
                {comments.map((comment, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{ paddingLeft: 0 }}>
                        <ListItemAvatar>
                            <Avatar>
                                {comment.author ? comment.author.firstName[0] : "?"}
                                {comment.author ? comment.author.lastName[0] : ""}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography variant="subtitle2" component="span" color="text.primary">
                                    {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : "Аноним"}
                                </Typography>
                            }
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', fontStyle: 'italic', mt: 0.5 }}
                                    >
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </Typography>
                                    <Typography variant="body2" component="span" sx={{ mt: 0.5, display: 'block' }}>
                                        {comment.content}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 3,
                    mt: 2
                }}
            >
                <TextField
                    placeholder="Написать комментарий..."
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={1}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ flexGrow: 1, mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <IconButton
                    color="primary"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    sx={{ p: 1.5 }}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
}

export default CommentSection;