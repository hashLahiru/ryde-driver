import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SingleTripViewScreen = ({ route, navigation }) => {
    const { ride_id } = route.params;
    const [tripDetails, setTripDetails] = useState([]);
    const [pickupPoint, setPickupPoint] = useState('');
    const [dropPoint, setDropPoint] = useState('');

    useEffect(() => {
        fetchTripDetails();
    }, []);

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

    const fetchTripDetails = async () => {
        const login_token = await AsyncStorage.getItem('login_token');
        try {
            const response = await fetch(
                'http://ryde100.introps.com/Driver/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function: 'getTripDetailsByRideId',
                        data: {
                            ride_id: ride_id,
                            login_token: login_token,
                        },
                    }),
                }
            );

            const result = await response.json();
            if (result.status === 'success') {
                console.log('Trip Details:', result.data);
                setTripDetails(result.data);

                const pickupAddress = await getAddressFromCoords(
                    result.data.start_point_lat,
                    result.data.start_point_long
                );

                const dropAddress = await getAddressFromCoords(
                    result.data.end_point_lat,
                    result.data.end_point_long
                );

                setPickupPoint(pickupAddress);
                setDropPoint(dropAddress);
            } else {
                setTripDetails(result.data);
            }
        } catch (error) {
            console.error('Error fetching trip detailssss:', error); // Log any network errors
        }
    };

    const trip = {
        id: '12345',
        startTime: '9:00 AM',
        endTime: '9:45 AM',
        cost: '$20.50',
        pickup: 'Times Square, NYC',
        drop: 'Central Park, NYC',
        driver: {
            name: 'John Doe',
            phone: '+1234567890',
            car: 'Toyota Prius',
            licensePlate: 'ABC-1234',
        },
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons
                            name="arrow-back"
                            size={28}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Trip Details</Text>
                </View>
            </View>

            {/* Trip Details */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Trip Information</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Start Time:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.start_time
                            ? tripDetails.start_time
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>End Time:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.end_time ? tripDetails.end_time : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Pickup :</Text>
                    <Text style={styles.value}>
                        {pickupPoint ? pickupPoint : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Drop:</Text>
                    <Text style={styles.value}>
                        {dropPoint ? dropPoint : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Driver Details */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Customer Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.sys_first_name &&
                        tripDetails?.sys_last_name
                            ? tripDetails.sys_first_name +
                              ' ' +
                              tripDetails.sys_last_name
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.sys_contact_1
                            ? tripDetails.sys_contact_1
                            : 'N/A'}
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Driver Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.sys_contact_1 &&
                        tripDetails?.sys_contact_1
                            ? tripDetails.driver_first_name +
                              ' ' +
                              tripDetails.driver_last_name
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.driver_contact
                            ? tripDetails.driver_contact
                            : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Vehicle:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.model ? tripDetails.model : 'N/A'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>License Plate:</Text>
                    <Text style={styles.value}>
                        {tripDetails?.reg_no ? tripDetails.reg_no : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Review Section */}
            <View style={styles.reviewCard}>
                {/* Stars */}
                <View style={styles.starsContainer}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <MaterialIcons
                            key={index}
                            name={
                                index < (tripDetails?.rider_rate || 0)
                                    ? 'star'
                                    : 'star-border'
                            }
                            size={30}
                            color="#FFC107"
                        />
                    ))}
                </View>
                <Text style={styles.reviewText}>
                    {tripDetails?.review
                        ? tripDetails.rider_review
                        : 'No review available'}
                </Text>
            </View>

            <View style={styles.costContainer}>
                <View style={styles.row}>
                    <Text style={styles.cardTitle}>Trip Cost:</Text>
                    <Text style={styles.costValue}>
                        {tripDetails?.price ? `$${tripDetails.price}` : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {
                    if (tripDetails?.sys_contact_1) {
                        const phoneNumber = `tel:${tripDetails.sys_contact_1}`;
                        Linking.openURL(phoneNumber);
                    } else {
                        alert('Customer phone number not available');
                    }
                }}
            >
                <MaterialIcons name="phone" size={24} color="#fff" />
                <Text style={styles.contactButtonText}>Contact Customer</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
    },
    headerContainer: {
        width: '100%',
    },
    header: {
        backgroundColor: '#FFC107',
        borderBottomRightRadius: 50,
        padding: 20,
        paddingTop: 50,
        height: 180,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    backIcon: {
        marginRight: 10,
        marginBottom: 70,
        color: 'white',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: -30,
        marginTop: 80,
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    costContainer: {
        backgroundColor: '#e9e2cf',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    costValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'black',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFC107',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    reviewCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        marginHorizontal: 15,
        alignItems: 'center', // Center the content horizontally
    },
    reviewText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#555',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default SingleTripViewScreen;
