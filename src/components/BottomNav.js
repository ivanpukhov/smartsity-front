// src/components/BottomNav.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Event, Forum, Help, Person, LocalPhone } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
        >
            <BottomNavigation
                value={location.pathname}
                onChange={(event, newValue) => {
                    navigate(newValue);
                }}
            >
                <BottomNavigationAction
                    value="/"
                    icon={<Event />}
                />
                <BottomNavigationAction
                    value="/discussions"
                    icon={<Forum />}
                />
                <BottomNavigationAction
                    value="/directory"
                    icon={<Help />}
                />
                <BottomNavigationAction
                    value="/emergency-services"
                    icon={<LocalPhone sx={{ color: 'red' }} />} // Иконка красного цвета
                />
                <BottomNavigationAction
                    value="/profile"
                    icon={<Person />}
                />
            </BottomNavigation>
        </Paper>
    );
}

export default BottomNav;
