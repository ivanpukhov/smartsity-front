import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, List, ListItem, Card, CardContent, Link } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function EmergencyServiceRequestsPage() {
    const { phoneNumber } = useParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get(`/emergency-services/${phoneNumber}/requests`);
                setRequests(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке обращений:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [phoneNumber]);

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>Обращения к службе {phoneNumber}</Typography>
            <List>
                {requests.length === 0 ? (
                    <Typography color="textSecondary">Обращения отсутствуют.</Typography>
                ) : (
                    requests.map((request) => {
                        const locationArray = request.location?.split(', ');
                        const position = locationArray ? { lat: parseFloat(locationArray[0]), lng: parseFloat(locationArray[1]) } : null;

                        return (
                            <ListItem key={request.id}>
                                <Card sx={{ width: '100%', borderRadius: 2, boxShadow: 1 }}>
                                    <CardContent>
                                        <Typography variant="h6">{request.message}</Typography>
                                        <Typography color="textSecondary" sx={{ mb: 1 }}>
                                            Дата: {new Date(request.createdAt).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Местоположение: {position ? (
                                            <MapContainer center={position} zoom={13} style={{ height: '200px', width: '100%' }}>
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={position}>
                                                    <Popup>
                                                        Местоположение: {request.location.toString()}
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        ) : 'Не указано'}
                                        </Typography>
                                        <Typography variant="body2">
                                            Телефон обратившегося:{" "}
                                            <Link href={`tel:${request.User.phone}`} color="primary">
                                                {request.User.phone}
                                            </Link>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        );
                    })
                )}
            </List>
        </Box>
    );
}

export default EmergencyServiceRequestsPage;
