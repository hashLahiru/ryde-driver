import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Animated, Easing } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const OnlineHome = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const blinkAnim = useState(new Animated.Value(0))[0];
    const [rideStatus, setRideStatus] = useState('looking'); // 'looking', 'found', 'searching'
    const [rideDetails, setRideDetails] = useState(null);
    const [tripStarted, setTripStarted] = useState(false); // New state for trip start button

    useEffect(() => {
        getLocation();
        startBlinking();
    }, []);

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
    };

    const startBlinking = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ]),
            { iterations: 6 } // Blinks for 6 iterations (~6 seconds)
        ).start(() => {
            setRideStatus('found');
            setRideDetails({
                pickup: "123 Main St, Downtown",
                drop: "456 Market St, City Center",
                distance: "5.2 km",
                price: "$12.50"
            });
        });
    };

    const handleReject = () => {
        setRideStatus('searching');
        setTimeout(() => {
            setRideStatus('looking');
            startBlinking();
        }, 2000);
    };

    const handleAccept = () => {
        setTripStarted(true);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={30} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Online Mode</Text>
                <View style={styles.onlineStatus}>
                    <Text style={styles.onlineStatusText}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: '#999', true: 'black' }}
                        thumbColor={isOnline ? '#fff' : '#fff'}
                    />
                </View>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title="Your Location"
                        />
                    </MapView>
                ) : (
                    <Text>Fetching location...</Text>
                )}
            </View>

            {/* Bottom Container */}
            {isOnline && (
                <View style={styles.bottomContainer}>
                    {rideStatus === 'looking' && (
                        <Animated.Text style={[styles.blinkingText, { opacity: blinkAnim }]}>
                            Looking for Rides...
                        </Animated.Text>
                    )}

                    {rideStatus === 'searching' && (
                        <Text style={styles.searchingText}>Looking for Rides Again...</Text>
                    )}

                    {rideStatus === 'found' && rideDetails && (
                        <View style={styles.rideCard}>
                            <Text style={styles.rideTitle}>Ride Found</Text>
                            <View style={styles.rideRow}>
                                <Ionicons name="location-outline" size={20} color="#555" />
                                <Text style={styles.rideText}>{rideDetails.pickup}</Text>
                            </View>
                            <View style={styles.rideRow}>
                                <Ionicons name="flag-outline" size={20} color="#555" />
                                <Text style={styles.rideText}>{rideDetails.drop}</Text>
                            </View>
                            <View style={styles.rideRow}>
                                <FontAwesome5 name="road" size={18} color="#555" />
                                <Text style={styles.rideText}>{rideDetails.distance}</Text>
                            </View>
                            <View style={styles.rideRow}>
                                <FontAwesome5 name="dollar-sign" size={18} color="#28a745" />
                                <Text style={[styles.rideText, styles.priceText]}>
                                    {rideDetails.price}
                                </Text>
                            </View>

                            {/* Button Section */}
                            <View style={styles.buttonContainer}>
                                {!tripStarted ? (
                                    <>
                                        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                                            <Text style={styles.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                                            <Text style={styles.buttonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity style={styles.startTripButton}>
                                        <Text style={styles.buttonText}>Start Trip</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        backgroundColor: '#FFC107',
        padding: 20,
        paddingTop: 40,
        borderBottomRightRadius: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backIcon: { color: '#fff' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    onlineStatus: { flexDirection: 'row', alignItems: 'center' },
    onlineStatusText: { fontSize: 14, fontWeight: 'bold', color: 'black', marginRight: 5 },
    mapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    map: { width: '100%', height: '100%' },
    bottomContainer: { backgroundColor: '#fff', padding: 20, height: 220, alignItems: 'center', justifyContent: 'center' },
    blinkingText: { fontSize: 18, fontWeight: 'bold', color: '#1f1f1f' },
    searchingText: { fontSize: 16, fontWeight: 'bold', color: 'red' },
    rideCard: { width: '100%', backgroundColor: '#fff' },
    rideTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    rideRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    rideText: { fontSize: 16, color: '#555', marginLeft: 10 },
    priceText: { color: '#28a745', fontWeight: 'bold' },
    buttonContainer: { flexDirection: 'row', marginTop: 15, gap: 5 },
    acceptButton: { backgroundColor: '#FFC107', padding: 12, borderRadius: 8, minWidth: 180, alignItems: 'center' },
    rejectButton: { backgroundColor: '#1f1f1f', padding: 12, borderRadius: 8, minWidth: 115, alignItems: 'center' },
    startTripButton: { backgroundColor: '#FFC107', padding: 12, borderRadius: 8, minWidth: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OnlineHome;
