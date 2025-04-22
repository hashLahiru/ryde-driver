import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Animated,
    Easing,
    Modal,
    ActivityIndicator,
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
    const [tripStarted, setTripStarted] = useState(false);
    const [region, setRegion] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [pickupAddress, setPickupAddress] = useState('Fetching address...');
    const [dropAddress, setDropAddress] = useState('Fetching address...');
    const [routeDistance, setRouteDistance] = useState('Calculating...');
    const [routePrice, setRoutePrice] = useState('Calculating...');
    const [routeDuration, setRouteDuration] = useState('Calculating...');
    const [approvedRideId, setApprovedRideId] = useState('');
    const [pendingRideId, setPendingRideId] = useState('');
    const [startStripButtonText, setStartStripButtonText] =
        useState('Start Trip');
    const [startTripButtonStyle, setStartTripButtonStyle] = useState(
        styles.startTripButton
    );
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [rideSummary, setRideSummary] = useState(null);

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
            blinkAnim.stopAnimation(); // Stop the blinking animation
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

            const selectedVehicleId = await AsyncStorage.getItem(
                'selected_vehicle_id'
            );
            if (!selectedVehicleId) {
                console.error('No selected Vehicle');
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
                    vehicle_id: selectedVehicleId.toString(),
                    latitude: location.coords.latitude.toString(),
                    longitude: location.coords.longitude.toString(),
                    status: status,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/DriverVehicle/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(requestData),
                }
            );

            // First read the response as text
            const responseText = await response.text();

            // Try to extract JSON from the response (handles PHP errors in output)
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}');

            if (jsonStart === -1 || jsonEnd === -1) {
                console.error('No JSON found in response:', responseText);
                throw new Error('Invalid server response format');
            }

            try {
                const jsonString = responseText.substring(
                    jsonStart,
                    jsonEnd + 1
                );
                const data = JSON.parse(jsonString);
                console.log('Location Updated:', data);
                return data;
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Failed to process server response');
            }
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
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
        }, 15000);
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

            // Change this to get vehicle_id from AsyncStorage
            const vehicle_id = await AsyncStorage.getItem(
                'selected_vehicle_id'
            );
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
                'http://ryde100.introps.com/DriverRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(searchRideData),
                }
            );

            const data = await response.json();
            // console.log('Ride Search:', data);

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
                setPendingRideId(data.data.pending_ride.pending_id);
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
        // console.log(
        //     'Fetching pickup address:',
        //     coords.latitude,
        //     coords.longitude
        // );
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_DIRECTIONS_API_KEY}`
            );
            const data = await response.json();
            // console.log('Pickup Address Data:', data);
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
        // console.log('Drop Coords:', coords.latitude, coords.longitude);
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
                setRouteDuration(data.routes[0].legs[0].duration.text);
                setRoutePrice((distanceInKm * 50).toFixed(2));
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    const fetchApproveRide = async () => {
        try {
            const vehicle_id = await AsyncStorage.getItem(
                'selected_vehicle_id'
            );
            const login_token = await AsyncStorage.getItem('login_token');

            const approveData = {
                function: 'ApproveRide',
                data: {
                    login_token: login_token,
                    vehicle_id: vehicle_id,
                    distance: routeDistance,
                    duration: routeDuration,
                    price: routePrice,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/DriverRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(approveData),
                }
            );

            const data = await response.json();
            console.log('Approved Ride ID : ', data.ride_id);

            if (data && data.status === 'success') {
                const rideId = data.ride_id;
                setApprovedRideId(rideId);
            }
        } catch (error) {}
    };

    const fetchRejectRide = async () => {
        try {
            const pending_ride_id = pendingRideId;
            const login_token = await AsyncStorage.getItem('login_token');

            const rejectData = {
                function: 'RejectRide',
                data: {
                    login_token: login_token,
                    pending_ride_id: pending_ride_id,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/DriverRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rejectData),
                }
            );

            const data = await response.json();
            // console.log('Reject Response : ', data);

            if (data && data.status === 'success') {
                setRideStatus('looking');
            }
        } catch (error) {}
    };

    const fetchStartRide = async () => {
        try {
            const login_token = await AsyncStorage.getItem('login_token');
            if (!login_token) {
                console.error('Login token missing');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (!location) {
                console.error('Failed to get location');
                return;
            }

            const ride_id = approvedRideId;

            const startRideData = {
                function: 'StartRide',
                data: {
                    login_token: login_token,
                    trip_id: ride_id,
                    start_point_lat: location.coords.latitude.toString(),
                    start_point_long: location.coords.longitude.toString(),
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/DriverRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(startRideData),
                }
            );

            const data = await response.json();
            console.log('Start Ride Response:', data);
        } catch (error) {
            console.error('Error starting ride:', error);
        }
    };

    const fetchEndRide = async () => {
        try {
            const login_token = await AsyncStorage.getItem('login_token');
            if (!login_token) {
                console.error('Login token missing');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            if (!location) {
                console.error('Failed to get location');
                return;
            }

            const ride_id = approvedRideId;

            const endRideData = {
                function: 'EndRide',
                data: {
                    login_token: login_token,
                    trip_id: ride_id,
                    end_point_lat: location.coords.latitude.toString(),
                    end_point_long: location.coords.longitude.toString(),
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/EndRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(endRideData),
                }
            );

            const data = await response.json();
            console.log('End Ride Response:', data);

            if (data.status === 'success') {
                // Extract summary data from response
                const summary = {
                    distance: data.data.distance,
                    duration: data.data.trip_duration,
                    price: data.data.price,
                };
                setRideSummary(summary);
                setShowSummaryModal(true);
            }
        } catch (error) {
            console.error('Error ending ride', error);
        }
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
        blinkAnim.setValue(0); // Reset animation value
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
            ])
        ).start();
    };

    const handleReject = () => {
        setRideStatus('searching');
        fetchRejectRide();
        setTimeout(() => {
            setRideStatus('looking');
            startBlinking();
        }, 2000);
    };

    const handleAccept = () => {
        setRideStatus('accepted');
        fetchApproveRide();
        stopRideCheck();
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
                    {/* Show "Looking for Rides..." only when status is 'looking' or 'searching' */}
                    {(rideStatus === 'looking' ||
                        rideStatus === 'searching') && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1f1f1f" />
                            <Animated.Text
                                style={[
                                    styles.blinkingText,
                                    { opacity: blinkAnim, marginTop: 10 },
                                ]}
                            >
                                Looking for Rides...
                            </Animated.Text>
                        </View>
                    )}

                    {/* Show ride details when ride is found or accepted */}
                    {(rideStatus === 'found' || rideStatus === 'accepted') && (
                        <View style={styles.rideCard}>
                            <Text style={styles.rideTitle}>
                                {rideStatus === 'accepted'
                                    ? 'Ride Accepted'
                                    : 'Ride Found'}
                            </Text>
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
                                {rideStatus === 'found' ? (
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
                                        style={startTripButtonStyle}
                                        onPress={() => {
                                            if (
                                                startStripButtonText ===
                                                'Start Trip'
                                            ) {
                                                fetchStartRide();
                                                setStartStripButtonText(
                                                    'End Trip'
                                                );
                                                setStartTripButtonStyle(
                                                    styles.endTripButton
                                                );
                                            } else {
                                                fetchEndRide();
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttonText}>
                                            {startStripButtonText}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            )}

            {showSummaryModal && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSummaryModal}
                    onRequestClose={() => setShowSummaryModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Ride Summary</Text>

                            {rideSummary && (
                                <>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>
                                            Distance:
                                        </Text>
                                        <Text style={styles.summaryValue}>
                                            {rideSummary.distance} km
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>
                                            Duration:
                                        </Text>
                                        <Text style={styles.summaryValue}>
                                            {rideSummary.duration} mins
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>
                                            Price:
                                        </Text>
                                        <Text style={styles.summaryValue}>
                                            LKR {rideSummary.price}
                                        </Text>
                                    </View>
                                </>
                            )}

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setShowSummaryModal(false);
                                    setRideStatus('looking');
                                    setTripStarted(false);
                                    setStartStripButtonText('Start Trip');
                                    setStartTripButtonStyle(
                                        styles.startTripButton
                                    );
                                    startRideCheck();
                                }}
                            >
                                <Text style={styles.closeButtonText}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        backgroundColor: '#FFC107',
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        paddingTop: '10%',
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
        padding: '5%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blinkingText: { fontSize: 18, fontWeight: 'bold', color: '#1f1f1f' },
    rideCard: { width: '100%', backgroundColor: '#fff' },
    rideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '2%',
    },
    rideRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '2%' },
    rideText: { fontSize: 16, color: '#555', marginLeft: '2%' },
    priceText: { color: '#1f1f1f', fontWeight: 'bold', fontSize: 24 },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: '5%',
        gap: '2%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },
    acceptButton: {
        backgroundColor: '#FFC107',
        paddingVertical: '4%',
        paddingHorizontal: '5%',
        borderRadius: 8,
        minWidth: '55%',
        alignItems: 'center',
        margin: '2%',
    },
    rejectButton: {
        backgroundColor: '#1f1f1f',
        paddingVertical: '4%',
        paddingHorizontal: '5%',
        borderRadius: 8,
        minWidth: '35%',
        alignItems: 'center',
        margin: '2%',
    },
    startTripButton: {
        backgroundColor: '#FFC107',
        paddingVertical: '3%',
        paddingHorizontal: '5%',
        borderRadius: 8,
        minWidth: '90%',
        alignItems: 'center',
        marginTop: '5%',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    dropdownContainer: {
        marginBottom: 20,
    },
    dropdownLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    selectedVehicleContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selectedVehicleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#555',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#1f1f1f',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    endTripButton: {
        backgroundColor: '#1f1f1f',
        paddingVertical: '3%',
        paddingHorizontal: '5%',
        borderRadius: 8,
        minWidth: '90%',
        alignItems: 'center',
        marginTop: '5%',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, // space between loading and ride card
    },
});

export default OnlineHome;
