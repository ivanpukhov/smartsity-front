// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import AddEventPage from './pages/AddEventPage';
import DiscussionsPage from './pages/DiscussionsPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import AddDiscussionPage from './pages/AddDiscussionPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DirectoryServicePage from './pages/DirectoryServicePage';
import EmergencyServicesPage from './pages/EmergencyServicesPage';
import AddEmergencyRequestPage from './pages/AddEmergencyRequestPage';
import EmergencyServiceRequestsPage from './pages/EmergencyRequestsPage'; // Новый импорт
import BottomNav from './components/BottomNav';
import { setAuthToken } from './api';
import SendEmergencyAlertPage from "./pages/SendEmergencyAlertPage";
import AdminPage from "./pages/AdminPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <Route path="*" element={<AuthPage setIsAuthenticated={setIsAuthenticated} />} />
                ) : (
                    <>
                        <Route path="/" element={<EventsPage />} />
                        <Route path="/events/add" element={<AddEventPage />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route path="/discussions" element={<DiscussionsPage />} />
                        <Route path="/discussions/:id" element={<DiscussionDetailPage />} />
                        <Route path="/discussions/add" element={<AddDiscussionPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/profile/edit" element={<EditProfilePage />} />
                        <Route path="/directory" element={<DirectoryServicePage />} />
                        <Route path="/emergency-services" element={<EmergencyServicesPage />} />
                        <Route path="/send-emergency-alert" element={<SendEmergencyAlertPage />} /> {/* Новый маршрут */}
                        <Route path="/admin" element={<AdminPage />} />

                        <Route path="/emergency-services/:phoneNumber/add-request" element={<AddEmergencyRequestPage />} />
                        <Route path="/emergency-services/:phoneNumber/requests" element={<EmergencyServiceRequestsPage />} /> {/* Новый маршрут */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
            </Routes>
            {isAuthenticated && <BottomNav />}
        </Router>
    );
}

export default App;
