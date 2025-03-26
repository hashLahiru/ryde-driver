import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [sideMenuVisible, setSideMenuVisible] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const locationInterval = useRef(null);

    useEffect(() => {
        fetchVehicleData();
        if (isOnline) {
            startLocationUpdates();
        } else {
            stopLocationUpdates();
        }
        return () => stopLocationUpdates();
    }, [isOnline]);

    const fetchVehicleData = async () => {
        const login_token = await AsyncStorage.getItem('login_token');
        if (!login_token) {
            console.error('Login token missing');
            return;
        }

        const requestData = {
            function: 'getVehicleByToken',
            data: {
                login_token: login_token,
            },
        };

        fetch('http://ryde100.introps.com/App_apiv2/app_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setVehicles(data.data);
                    if (data.data.length > 0) {
                        setSelectedVehicle(data.data[0].vehicle_id);
                    }
                }
            })
            .catch((error) =>
                console.error('Error fetching vehicle data', error)
            );
    };

    const handleVehicleChange = (vehicleId) => {
        setSelectedVehicle(vehicleId);
        const selectedVehicleData = vehicles.find(
            (v) => v.vehicle_id === vehicleId
        );
        Alert.alert(
            `Vehicle changed to ${selectedVehicleData.reg_no} - ${selectedVehicleData.model}`
        );
    };

    const startLocationUpdates = async () => {
        await stopLocationUpdates();
        await sendLocationUpdate('active');
        locationInterval.current = setInterval(async () => {
            await sendLocationUpdate('active');
        }, 120000);
    };

    const stopLocationUpdates = async () => {
        if (locationInterval.current) {
            clearInterval(locationInterval.current);
            locationInterval.current = null;
        }
        await sendLocationUpdate('inactive');
    };

    const sendLocationUpdate = async (status) => {
        const login_token = await AsyncStorage.getItem('login_token');
        console.log('Login Token : ', login_token);
        if (!login_token) {
            console.error('login token missing');
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

        fetch('http://ryde100.introps.com/App_apiv2/app_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => console.log('Location Updated: ', data))
            .catch((error) =>
                console.error('Error fetching location : ', error)
            );
    };

    const toggleSideMenu = () => {
        setSideMenuVisible(!sideMenuVisible);
    };

    const handleMenuItemClick = (item) => {
        setSideMenuVisible(false);
        switch (item) {
            case 'Dashboard':
                navigation.navigate('TicketingScreen');
                break;
            case 'Earnings':
                navigation.navigate('EarningsScreen');
                break;
            case 'History':
                navigation.navigate('HistoryScreen');
                break;
            case 'Profile':
                navigation.navigate('UserScreen');
                break;
            case 'Support':
                navigation.navigate('SupportScreen');
                break;
            case 'Logout':
                Alert.alert('Logged out');
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={toggleSideMenu}>
                        <MaterialIcons
                            name="menu"
                            size={30}
                            style={styles.menuIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.logoText}>Ryde.lk</Text>
                    <View style={styles.onlineStatus}>
                        <Text style={styles.onlineStatusText}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                        <Switch
                            value={isOnline}
                            onValueChange={() => setIsOnline((prev) => !prev)}
                            trackColor={{ false: '#999', true: 'black' }}
                            thumbColor={isOnline ? '#fff' : '#fff'}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('NotificationsScreen')
                        }
                    >
                        <MaterialIcons
                            name="notifications-none"
                            size={28}
                            style={styles.notificationIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Side Menu */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={sideMenuVisible}
                onRequestClose={toggleSideMenu}
            >
                <View style={styles.sideMenu}>
                    <View style={styles.sideMenuHeader}>
                        <Image
                            source={require('../assets/images/adaptive-icon.png')}
                            style={styles.sideMenuLogo}
                        />
                        <Text style={styles.sideMenuTitle}>Ryde.lk</Text>
                    </View>
                    <View style={styles.menuItemsContainer}>
                        {[
                            'Dashboard',
                            'Earnings',
                            'History',
                            'Profile',
                            'Support',
                            'Logout',
                        ].map((item, index) => (
                            <Text
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleMenuItemClick(item)}
                            >
                                {item}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.sideMenuFooter}>
                        <Text style={styles.footerText}>
                            Powered by Introps IT
                        </Text>
                    </View>
                </View>
            </Modal>

            {/* Content */}
            <ScrollView style={styles.content}>
                {/* Driver Stats */}
                <View style={styles.statsContainer}>
    <TouchableOpacity 
        style={styles.statCard} 
        onPress={() => navigation.navigate('OnlineHome')}
    >
        <Text style={styles.statValue}>5</Text>
        <Text style={styles.statLabel}>Active Rides</Text>
    </TouchableOpacity>
    <View style={styles.statCard}>
        <Text style={styles.statValue}>$120</Text>
        <Text style={styles.statLabel}>Today Earnings</Text>
    </View>
    <View style={styles.statCard}>
        <Text style={styles.statValue}>4.8</Text>
        <Text style={styles.statLabel}>Rating</Text>
    </View>
</View>

                {/* Current Ride */}
                <Text style={styles.sectionTitle}>Current Ride</Text>
                <TouchableOpacity
                    style={styles.currentRideCard}
                    onPress={() => navigation.navigate('SingleTripViewScreen')}
                >
                    <Text style={styles.rideDetail}>Passenger: John Doe</Text>
                    <Text style={styles.rideDetail}>
                        Pickup: 123 Main Street
                    </Text>
                    <Text style={styles.rideDetail}>Dropoff: Central Park</Text>
                    <View style={styles.startRideButton}>
                        <Text style={styles.startRideText}>View Ride</Text>
                    </View>
                </TouchableOpacity>

                {/* Earnings Summary */}
                <Text style={styles.sectionTitle}>Earnings Summary</Text>
                <View style={styles.earningsCard}>
                    <Text style={styles.earningsText}>
                        Weekly Earnings: $560
                    </Text>
                    <Text style={styles.earningsText}>
                        Monthly Earnings: $2400
                    </Text>
                </View>

                {/* Support */}
                <TouchableOpacity
                    style={styles.supportButton}
                    onPress={() => navigation.navigate('SupportScreen')}
                >
                    <MaterialIcons
                        name="support-agent"
                        size={24}
                        color="#fff"
                    />
                    <Text style={styles.supportText}>Contact Support</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#FFC107',
        padding: width * 0.05,
        paddingTop: height * 0.05,
        height: height * 0.15,
        borderBottomRightRadius: width * 0.1,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuIcon: {
        color: '#fff',
    },
    logoText: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: width * 0.2,
    },
    notificationIcon: {
        color: '#fff',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
    },
    onlineStatusText: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 0,
    },
    sideMenu: {
        flex: 1,
        backgroundColor: '#333',
        padding: width * 0.05,
        width: '70%',
    },
    sideMenuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    sideMenuLogo: {
        width: width * 0.1,
        height: width * 0.1,
        marginRight: width * 0.025,
    },
    sideMenuTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
    },
    menuItemsContainer: {
        flex: 1,
    },
    menuItem: {
        fontSize: width * 0.045,
        paddingVertical: height * 0.02,
        color: '#fff',
    },
    sideMenuFooter: {
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: height * 0.01,
    },
    footerText: {
        color: '#fff',
        fontSize: width * 0.03,
    },
    content: {
        padding: width * 0.04,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.02,
        marginTop: height * 0.03,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#999999',
        borderRadius: width * 0.025,
        padding: width * 0.04,
        marginHorizontal: width * 0.01,
    },
    statValue: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: width * 0.035,
        color: '#fff',
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginVertical: height * 0.01,
    },
    currentRideCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: width * 0.025,
        padding: width * 0.04,
        marginBottom: height * 0.02,
    },
    rideDetail: {
        fontSize: width * 0.035,
        color: '#555',
        marginBottom: height * 0.005,
    },
    startRideButton: {
        marginTop: height * 0.01,
        backgroundColor: '#FFC107',
        padding: width * 0.025,
        paddingVertical: height * 0.014,
        borderRadius: width * 0.0125,
        alignItems: 'center',
    },
    startRideText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    earningsCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: width * 0.025,
        padding: width * 0.04,
        marginBottom: height * 0.02,
    },
    earningsText: {
        fontSize: width * 0.035,
        color: '#555',
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#999',
        borderRadius: width * 0.025,
        padding: width * 0.04,
        marginBottom: height * 0.02,
    },
    supportText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: 'bold',
        marginLeft: width * 0.025,
    },
    dropdown: {
        height: height * 0.05,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: width * 0.0125,
    },
});

export default HomeScreen;
