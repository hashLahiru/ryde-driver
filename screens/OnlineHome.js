import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Animated,
    Easing,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;
const GOOGLE_DIRECTIONS_API_KEY =
    Constants.expoConfig.extra.GOOGLE_DIRECTIONS_API_KEY;

const OnlineHome = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const blinkAnim = useState(new Animated.Value(0))[0];
    const [rideStatus, setRideStatus] = useState('looking');
    // const [rideDetails, setRideDetails] = useState({
    //     pickup: 'Pending',
    //     drop: 'Pending',
    //     distance: 'Calculating...',
    //     price: 'Pending',
    // });
    const [tripStarted, setTripStarted] = useState(false);
    const [region, setRegion] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [pickupAddress, setPickupAddress] = useState('Fetching address...');
    const [dropAddress, setDropAddress] = useState('Fetching address...');
    const [routeDistance, setRouteDistance] = useState('Calculating...');
    const [routePrice, setRoutePrice] = useState('Calculating...');

    const locationInterval = useRef(null);
    const rideCheckInterval = useRef(null);
    const isSendingRequest = useRef(false);
    const isCheckingRides = useRef(false);
    const lastRideCheckTime = useRef(0);
    const mapRef = useRef(null);

    useEffect(() => {
        getLocation();
        startBlinking();
        startLocationUpdates();
        startRideCheck();

        return () => {
            stopLocationUpdates();
            stopRideCheck();
        };
    }, []);

    const startLocationUpdates = async () => {
        await stopLocationUpdates();
        await sendLocationUpdate('active');

        locationInterval.current = setInterval(async () => {
            await sendLocationUpdate('active');
        }, 60000);
    };

    const stopLocationUpdates = async () => {
        if (locationInterval.current) {
            clearInterval(locationInterval.current);
            locationInterval.current = null;
        }
        await sendLocationUpdate('inactive');
    };

    const sendLocationUpdate = async (status) => {
        if (isSendingRequest.current) return;
        isSendingRequest.current = true;

        try {
            const login_token = await AsyncStorage.getItem('login_token');
            if (!login_token) {
                console.error('Login token missing');
                return;
            }

            const { status: permissionStatus } =
                await Location.requestForegroundPermissionsAsync();
            if (permissionStatus !== 'granted') {
                console.error('Location permission not granted');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (!location) {
                console.error('Failed to get location');
                return;
            }

            setLocation(location.coords);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            const requestData = {
                function: 'UpdateVehicleLocation',
                data: {
                    login_token: login_token,
                    vehicle_id: '124',
                    latitude: location.coords.latitude.toString(),
                    longitude: location.coords.longitude.toString(),
                    status: status,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/App_apiv2/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                }
            );

            const data = await response.json();
            console.log('Location Updated:', data);
        } catch (error) {
            console.error('Error updating location:', error);
        } finally {
            isSendingRequest.current = false;
        }
    };

    const startRideCheck = () => {
        stopRideCheck();
        searchRideRequests();

        rideCheckInterval.current = setInterval(() => {
            const now = Date.now();
            if (now - lastRideCheckTime.current >= 10000) {
                searchRideRequests();
            }
        }, 10000);
    };

    const stopRideCheck = () => {
        if (rideCheckInterval.current) {
            clearInterval(rideCheckInterval.current);
            rideCheckInterval.current = null;
        }
    };

    const searchRideRequests = async () => {
        const now = Date.now();
        if (isCheckingRides.current || !isOnline) return;

        if (now - lastRideCheckTime.current < 10000) return;

        isCheckingRides.current = true;
        lastRideCheckTime.current = now;

        try {
            const login_token = await AsyncStorage.getItem('login_token');
            if (!login_token) {
                console.error('Login token missing');
                return;
            }

            const vehicle_id = '126';
            if (!vehicle_id) {
                console.error('Vehicle id missing');
                return;
            }

            const searchRideData = {
                function: 'FindRide',
                data: {
                    login_token: login_token,
                    vehicle_id: vehicle_id,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/App_apiv2/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(searchRideData),
                }
            );

            const data = await response.json();
            console.log('Ride Search:', data);

            if (data.status === 'success' && data.data?.pending_ride) {
                const vehicleSearch = data.data.vehicle_search;
                const pickup = {
                    latitude: parseFloat(vehicleSearch.start_lat),
                    longitude: parseFloat(vehicleSearch.start_long),
                };
                const drop = {
                    latitude: parseFloat(vehicleSearch.end_lat),
                    longitude: parseFloat(vehicleSearch.end_long),
                };

                setRideStatus('found');
                setPickupCoords(pickup);
                setDropCoords(drop);
                fetchPickupAddress(pickup);
                fetchDropAddress(drop);

                // Calculate route
                fetchRoute(pickup, drop);
            } else {
                setRideStatus('looking');
                setPickupCoords(null);
                setDropCoords(null);
            }
        } catch (error) {
            console.error('Error finding ride:', error);
            setRideStatus('looking');
        } finally {
            isCheckingRides.current = false;
        }
    };

    const fetchPickupAddress = async (coords) => {
        console.log(
            'Fetching pickup address:',
            coords.latitude,
            coords.longitude
        );
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_DIRECTIONS_API_KEY}`
            );
            const data = await response.json();
            console.log('Pickup Address Data:', data);
            if (data.results && data.results[0]) {
                const compoundCode = data.plus_code.compound_code;
                const address = compoundCode.substring(
                    compoundCode.indexOf(' ') + 1
                );
                setPickupAddress(address);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const fetchDropAddress = async (coords) => {
        console.log('Drop Coords:', coords.latitude, coords.longitude);
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_DIRECTIONS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
                const compoundCode = data.plus_code.compound_code;
                const address = compoundCode.substring(
                    compoundCode.indexOf(' ') + 1
                );
                setDropAddress(address);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const fetchRoute = async (origin, destination) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_DIRECTIONS_API_KEY}`
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                setRouteDistance(data.routes[0].legs[0].distance.text);
                const distanceInKm = parseFloat(
                    data.routes[0].legs[0].distance.text.replace(/[^\d.]/g, '')
                );
                setRoutePrice((distanceInKm * 50).toFixed(2));
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    const calculatePrice = (distanceMeters) => {
        const baseFare = 100; // LKR
        const perKmRate = 50; // LKR
        const distanceKm = distanceMeters / 1000;
        return `LKR ${(baseFare + distanceKm * perKmRate).toFixed(2)}`;
    };

    const getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            console.error('Error getting location:', error);
        }
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
                }),
            ]),
            { iterations: 6 }
        ).start();
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

    const handleToggleOnline = async (value) => {
        if (!value) {
            await stopLocationUpdates();
            navigation.navigate('Home');
        }
        setIsOnline(value);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons
                        name="arrow-back"
                        size={30}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Online Mode</Text>
                <View style={styles.onlineStatus}>
                    <Text style={styles.onlineStatusText}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={handleToggleOnline}
                        trackColor={{ false: '#999', true: 'black' }}
                        thumbColor={isOnline ? '#fff' : '#fff'}
                    />
                </View>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
                {region ? (
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={region}
                        showsUserLocation={true}
                    >
                        {location && (
                            <Marker
                                coordinate={location}
                                title="Your Location"
                                pinColor="#1f1f1f"
                            />
                        )}

                        {pickupCoords && (
                            <Marker
                                coordinate={pickupCoords}
                                title="Pickup Location"
                                pinColor="#FFC107"
                            />
                        )}

                        {dropCoords && (
                            <Marker
                                coordinate={dropCoords}
                                title="Drop Location"
                                pinColor="#1f1f1f"
                            />
                        )}

                        {location && pickupCoords && (
                            <MapViewDirections
                                origin={location}
                                destination={pickupCoords}
                                apikey={GOOGLE_DIRECTIONS_API_KEY}
                                strokeWidth={4}
                                strokeColor="#FFC107"
                            />
                        )}

                        {pickupCoords && dropCoords && (
                            <MapViewDirections
                                origin={pickupCoords}
                                destination={dropCoords}
                                apikey={GOOGLE_DIRECTIONS_API_KEY}
                                strokeWidth={4}
                                strokeColor="#1f1f1f"
                            />
                        )}
                    </MapView>
                ) : (
                    <Text>Fetching location...</Text>
                )}
            </View>

            {/* Bottom Container */}
            {isOnline && (
                <View style={styles.bottomContainer}>
                    {rideStatus === 'looking' && (
                        <Animated.Text
                            style={[
                                styles.blinkingText,
                                { opacity: blinkAnim },
                            ]}
                        >
                            Looking for Rides...
                        </Animated.Text>
                    )}

                    {rideStatus === 'found' && (
                        <View style={styles.rideCard}>
                            <Text style={styles.rideTitle}>Ride Found</Text>
                            <View style={styles.rideRow}>
                                <Ionicons
                                    name="location-outline"
                                    size={20}
                                    color="#555"
                                />
                                <Text style={styles.rideText}>
                                    {pickupAddress}
                                </Text>
                            </View>
                            <View style={styles.rideRow}>
                                <Ionicons
                                    name="flag-outline"
                                    size={20}
                                    color="#555"
                                />
                                <Text style={styles.rideText}>
                                    {dropAddress}
                                </Text>
                            </View>
                            <View style={styles.rideRow}>
                                <FontAwesome5
                                    name="road"
                                    size={18}
                                    color="#555"
                                />
                                <Text style={styles.rideText}>
                                    {routeDistance}
                                </Text>
                            </View>
                            <View style={styles.rideRow}>
                                <FontAwesome5
                                    name="dollar-sign"
                                    size={24}
                                    color="#1f1f1f"
                                />
                                <Text
                                    style={[styles.rideText, styles.priceText]}
                                >
                                    {routePrice}
                                </Text>
                            </View>

                            <View style={styles.buttonContainer}>
                                {!tripStarted ? (
                                    <>
                                        <TouchableOpacity
                                            style={styles.acceptButton}
                                            onPress={handleAccept}
                                        >
                                            <Text style={styles.buttonText}>
                                                Accept
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.rejectButton}
                                            onPress={handleReject}
                                        >
                                            <Text style={styles.buttonText}>
                                                Reject
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.startTripButton}
                                    >
                                        <Text style={styles.buttonText}>
                                            Start Trip
                                        </Text>
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
    onlineStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 5,
    },
    mapContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    map: { width: '100%', height: '100%' },
    bottomContainer: {
        backgroundColor: '#fff',
        padding: 20,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blinkingText: { fontSize: 18, fontWeight: 'bold', color: '#1f1f1f' },
    rideCard: { width: '100%', backgroundColor: '#fff' },
    rideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    rideRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    rideText: { fontSize: 16, color: '#555', marginLeft: 10 },
    priceText: { color: '#1f1f1f', fontWeight: 'bold', fontSize: 24 },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    acceptButton: {
        backgroundColor: '#FFC107',
        padding: 12,
        borderRadius: 8,
        minWidth: 180,
        alignItems: 'center',
        margin: 5, // Added margin for spacing
    },
    rejectButton: {
        backgroundColor: '#1f1f1f',
        padding: 12,
        borderRadius: 8,
        minWidth: 115,
        alignItems: 'center',
        margin: 5, // Added margin for spacing
    },
    startTripButton: {
        backgroundColor: '#FFC107',
        padding: 12,
        borderRadius: 8,
        minWidth: '100%',
        alignItems: 'center',
        marginTop: 10, // Added margin for spacing
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OnlineHome;
