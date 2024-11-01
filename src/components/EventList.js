// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import EventItem from './EventItem';
import api from '../api';

function EventList({ selectedTag, isAllEvents }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const endpoint = isAllEvents ? '/events' : '/events/user-feed';
                const response = await api.get(endpoint);
                const filteredEvents = selectedTag ? response.data.filter(event => event.tags.includes(selectedTag)) : response.data;
                setEvents(filteredEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [selectedTag, isAllEvents]);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            {events.length ? events.map(event => <EventItem key={event.id} event={event} />) : (
                <Typography>Нет мероприятий для выбранных интересов.</Typography>
            )}
        </Box>
    );
}

export default EventList;
