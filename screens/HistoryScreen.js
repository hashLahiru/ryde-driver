import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
    const navigation = useNavigation();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRideHistory();
    }, []);

    const fetchRideHistory = async () => {
        try {
            const loginToken = await AsyncStorage.getItem('login_token');

            const response = await fetch(
                'http://ryde100.introps.com/Driver/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function: 'GetRideHistory',
                        data: {
                            login_token:
                                loginToken ||
                                'a36794049e76cb136e09e723e5431baf',
                        },
                    }),
                }
            );

            const data = await response.json();

            if (data.status === 'success') {
                // Fetch address details for each ride
                const ridesWithAddresses = await Promise.all(
                    data.data.map(async (ride) => {
                        const startAddress = await getAddressFromCoords(
                            ride.start_point_lat || ride.start_location_lat,
                            ride.start_point_long || ride.start_location_long
                        );
                        const endAddress = await getAddressFromCoords(
                            ride.end_point_lat || ride.end_location_lat,
                            ride.end_point_long || ride.end_location_long
                        );
                        return {
                            ...ride,
                            startAddress,
                            endAddress,
                        };
                    })
                );
                setRides(ridesWithAddresses);
            } else {
                setError('Failed to fetch ride history');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching ride history:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAddressFromCoords = async (lat, lng) => {
        if (!lat || !lng) return 'Location not available';

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAzjm5FmkJ1AI0MSde4vmoXeJY5lZXlAFY`
            );
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                return data.results[0].formatted_address;
            }
            return 'Address not found';
        } catch (err) {
            console.error('Error fetching address:', err);
            return 'Address lookup failed';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFC107" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchRideHistory}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ride History</Text>
            </View>

            {/* History List Section */}
            <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Your Recent Rides</Text>

                {rides.length === 0 ? (
                    <Text style={styles.noRidesText}>
                        No ride history available
                    </Text>
                ) : (
                    rides.map((ride, index) => (
                        <TouchableOpacity
                            key={ride.ride_id}
                            style={styles.historyItem}
                        >
                            <Text style={styles.historyTitle}>
                                Ride #{rides.length - index}
                            </Text>
                            <Text style={styles.historyDate}>
                                {formatDate(ride.accepted_time)}
                            </Text>
                            <View style={styles.addressContainer}>
                                <MaterialIcons
                                    name="location-on"
                                    size={16}
                                    color="#FF5722"
                                />
                                <Text style={styles.addressText}>
                                    {ride.startAddress ||
                                        'Pickup location not available'}
                                </Text>
                            </View>
                            <View style={styles.addressContainer}>
                                <MaterialIcons
                                    name="location-off"
                                    size={16}
                                    color="#4CAF50"
                                />
                                <Text style={styles.addressText}>
                                    {ride.endAddress ||
                                        'Dropoff location not available'}
                                </Text>
                            </View>
                            <View style={styles.rideDetails}>
                                <Text
                                    style={[
                                        styles.detailText,
                                        { fontWeight: 'bold' },
                                    ]}
                                >
                                    Distance: {ride.distance} km
                                </Text>
                                <Text
                                    style={[
                                        styles.detailText,
                                        { fontWeight: 'bold' },
                                    ]}
                                >
                                    <span>Price:</span>
                                    Rs. {ride.price}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    ride.status === 'completed'
                                        ? styles.completedBadge
                                        : ride.status === 'approved'
                                          ? styles.approvedBadge
                                          : styles.otherBadge,
                                ]}
                            >
                                <Text style={styles.statusText}>
                                    {ride.status}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 16,
        marginBottom: 10,
    },
    retryText: {
        color: '#FFC107',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#FFC107',
        padding: 25,
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomRightRadius: 40,
        paddingTop: 30,
    },
    iconButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 15,
    },
    historySection: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    noRidesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    historyItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        position: 'relative',
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    historyDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 14,
        color: '#444',
        marginLeft: 5,
        flex: 1,
    },
    rideDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
    },
    statusBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    completedBadge: {
        backgroundColor: '#E8F5E9',
    },
    approvedBadge: {
        backgroundColor: '#E3F2FD',
    },
    otherBadge: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default HistoryScreen;
