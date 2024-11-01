// src/pages/DiscussionDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import api from '../api';
import DiscussionCommentSection from '../components/DiscussionCommentSection';

function DiscussionDetailPage() {
    const { id } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const response = await api.get(`/proposals/${id}`);
                setDiscussion(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке обсуждения:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscussion();
    }, [id]);

    const handleVote = async (type) => {
        try {
            await api.post(`/proposals/${id}/vote`, { vote: type });
            setDiscussion(prev => ({
                ...prev,
                upvotes: type === 'up' ? prev.upvotes + 1 : prev.upvotes,
                downvotes: type === 'down' ? prev.downvotes + 1 : prev.downvotes,
            }));
        } catch (error) {
            console.error("Ошибка при голосовании:", error);
        }
    };

    if (loading) return <CircularProgress />;

    if (!discussion) return <Typography variant="h6">Обсуждение не найдено.</Typography>;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>{discussion.title}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{discussion.description}</Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <IconButton onClick={() => handleVote('up')}>
                    <ThumbUp color="primary" />
                </IconButton>
                <Typography>{discussion.upvotes}</Typography>
                <IconButton onClick={() => handleVote('down')}>
                    <ThumbDown color="secondary" />
                </IconButton>
                <Typography>{discussion.downvotes}</Typography>
            </Box>
            <DiscussionCommentSection discussionId={id} />
        </Box>
    );
}

export default DiscussionDetailPage;
