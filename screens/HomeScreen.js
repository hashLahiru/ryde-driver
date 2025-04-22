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
    FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [sideMenuVisible, setSideMenuVisible] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const locationInterval = useRef(null);
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const fetchDataAndCheckStatus = async () => {
            const login_token = await AsyncStorage.getItem('login_token');

            if (!login_token) {
                console.warn(
                    'No login token found. Redirecting to Onboarding2...'
                );
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Onboarding2' }],
                });
                return;
            }

            await fetchVehicleData();

            if (isOnline) {
                // startLocationUpdates();
                navigation.navigate('OnlineHome');
            } else {
                stopLocationUpdates();
            }
        };

        fetchDataAndCheckStatus();

        return () => stopLocationUpdates();
    }, [isOnline]);

    const fetchVehicleData = async () => {
        const login_token = await AsyncStorage.getItem('login_token');
        if (!login_token) {
            console.error('Login token missing');
            return;
        }

        const requestData = {
            function: 'getVehiclesByToken',
            data: {
                login_token: login_token,
            },
        };

        try {
            const response = await fetch(
                'http://ryde100.introps.com/DriverVehicle/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                }
            );
            const data = await response.json();
            console.log('Vehicle Data: ', data);

            if (data.status === 'success' && data.data?.length > 0) {
                setVehicles(data.data);

                // Load saved vehicle from AsyncStorage
                const savedVehicleId = await AsyncStorage.getItem(
                    'selected_vehicle_id'
                );

                // Check if saved vehicle exists in the fetched data
                const vehicleExists = data.data.some(
                    (v) => v.vehicle_id === savedVehicleId
                );

                if (savedVehicleId && vehicleExists) {
                    // Use the saved vehicle if it exists
                    setSelectedVehicle(savedVehicleId);
                    console.log('Using saved vehicle ID:', savedVehicleId);
                } else {
                    // Otherwise use the first vehicle and save it
                    const firstVehicleId = data.data[0].vehicle_id.toString();
                    setSelectedVehicle(firstVehicleId);
                    await AsyncStorage.setItem(
                        'selected_vehicle_id',
                        firstVehicleId
                    );
                    console.log('Setting default vehicle ID:', firstVehicleId);
                }
            }
        } catch (error) {
            console.error('Error fetching vehicle data', error);
        }
    };

    const handleVehicleChange = async (vehicleId) => {
        if (!vehicleId) return;

        const selectedVehicleData = vehicles.find(
            (v) => v.vehicle_id === vehicleId
        );
        if (selectedVehicleData) {
            // Update both state and storage
            setSelectedVehicle(vehicleId);
            await AsyncStorage.setItem(
                'selected_vehicle_id',
                vehicleId.toString() // Ensure we store as string
            );

            console.log('Vehicle changed to:', vehicleId);
            Alert.alert(
                `Vehicle changed to ${selectedVehicleData.reg_no} | ${selectedVehicleData.model}`
            );
        }
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
        try {
            const login_token = await AsyncStorage.getItem('login_token');
            const vehicle_id = await AsyncStorage.getItem(
                'selected_vehicle_id'
            );

            if (!login_token || !vehicle_id) {
                throw new Error('Missing required credentials');
            }

            const { status: permissionStatus } =
                await Location.requestForegroundPermissionsAsync();
            if (permissionStatus !== 'granted') {
                throw new Error('Location permission not granted');
            }

            const location = await Location.getCurrentPositionAsync({});
            if (!location) {
                throw new Error('Failed to get location');
            }

            const requestData = {
                function: 'UpdateVehicleLocation',
                data: {
                    login_token,
                    vehicle_id,
                    latitude: location.coords.latitude.toString(),
                    longitude: location.coords.longitude.toString(),
                    status,
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

            const rawResponse = await response.text();

            const jsonStart = rawResponse.indexOf('{');
            const jsonEnd = rawResponse.lastIndexOf('}');

            if (jsonStart === -1 || jsonEnd === -1) {
                console.error('No JSON found in response:', rawResponse);
                throw new Error('Invalid server response format');
            }

            try {
                const jsonString = rawResponse.substring(
                    jsonStart,
                    jsonEnd + 1
                );
                const data = JSON.parse(jsonString);

                if (data.status === 'success') {
                    console.log('Location update successful:', data.message);
                    return data;
                } else {
                    throw new Error(data.message || 'Update failed');
                }
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Failed to process server response');
            }
        } catch (error) {
            console.error('Error in sendLocationUpdate:', error.message);
            throw error;
        }
    };

    const toggleSideMenu = () => {
        setSideMenuVisible(!sideMenuVisible);
    };

    const handleMenuItemClick = (item) => {
        setSideMenuVisible(false);
        switch (item) {
            case 'Dashboard':
                navigation.navigate('Home');
                break;
            case 'Tickets':
                navigation.navigate('TicketingScreen');
                break;
            case 'Earnings':
                navigation.navigate('PaymentsScreen');
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
                setShowLogoutModal(true);
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
                            'Tickets',
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
                {/* Active Rides Dropdown */}
                <View style={styles.container}>
                    {/* Dropdown for Active Rides */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>
                            Select a vehicle
                        </Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setShowVehicleSelector(true)}
                        >
                            <Text style={styles.selectorButtonText}>
                                {selectedVehicle && vehicles.length > 0
                                    ? `${vehicles.find((v) => v.vehicle_id === selectedVehicle)?.reg_no || ''} | ${vehicles.find((v) => v.vehicle_id === selectedVehicle)?.model || ''}`
                                    : 'Select a vehicle'}
                            </Text>
                            <MaterialIcons
                                name="arrow-drop-down"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>

                        {/* Vehicle Selection Modal */}
                        <Modal
                            visible={showVehicleSelector}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowVehicleSelector(false)}
                        >
                            <View style={styles.selectorModalContainer}>
                                <View style={styles.selectorModal}>
                                    <Text style={styles.selectorTitle}>
                                        Select Vehicle
                                    </Text>

                                    <FlatList
                                        data={vehicles}
                                        keyExtractor={(item) => item.vehicle_id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.vehicleItem,
                                                    selectedVehicle ===
                                                        item.vehicle_id &&
                                                        styles.selectedVehicleItem,
                                                ]}
                                                onPress={() => {
                                                    handleVehicleChange(
                                                        item.vehicle_id
                                                    );
                                                    setShowVehicleSelector(
                                                        false
                                                    );
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        styles.vehicleItemText
                                                    }
                                                >
                                                    {item.reg_no} | {item.model}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        ItemSeparatorComponent={() => (
                                            <View style={styles.separator} />
                                        )}
                                    />

                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() =>
                                            setShowVehicleSelector(false)
                                        }
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* Update the selected vehicle display section */}
                    {selectedVehicle && vehicles.length > 0 && (
                        <View style={styles.selectedVehicleContainer}>
                            <Text style={styles.selectedVehicleText}>
                                Selected Vehicle:{' '}
                                {`${
                                    vehicles.find(
                                        (v) => v.vehicle_id === selectedVehicle
                                    )?.reg_no || ''
                                } | ${
                                    vehicles.find(
                                        (v) => v.vehicle_id === selectedVehicle
                                    )?.model || ''
                                }`}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Driver Stats */}
                <Text style={styles.statTitle}>Today Stats</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>5</Text>
                        </View>
                        <Text style={styles.statLabel}>Rides</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>$1200</Text>
                        </View>
                        <Text style={styles.statLabel}>Earned</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>4.8</Text>
                        </View>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Current Ride */}
                <Text style={styles.sectionTitle}>Last Ride</Text>
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

            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            Are you sure you want to logout?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    { backgroundColor: '#ccc' },
                                ]}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text style={{ fontSize: '16' }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    { backgroundColor: '#f33' },
                                ]}
                                onPress={async () => {
                                    setShowLogoutModal(false);
                                    await AsyncStorage.removeItem(
                                        'login_token'
                                    );
                                    navigation.replace('Onboarding2'); // or navigation.navigate
                                }}
                            >
                                <Text
                                    style={{ color: 'white', fontSize: '16' }}
                                >
                                    Yes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#999999',
        borderRadius: width * 0.025,
        padding: width * 0.03,
        marginHorizontal: width * 0.01,
        marginTop: height * 0.01,
    },
    statValueContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    statValue: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: width * 0.035,
        color: '#fff',
        marginTop: height * 0.01,
    },
    statTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        marginTop: height * 0.02,
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
    dropdownContainer: {
        marginBottom: 0,
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
    iosPickerTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    iosPickerText: {
        fontSize: 16,
    },
    iosPickerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iosPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderTopWidth: 1,
        borderTopColor: '#ececec',
    },
    iosPickerCancel: {
        color: '#007AFF',
        fontSize: 16,
    },
    iosPickerDone: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    iosPicker: {
        backgroundColor: 'white',
    },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    selectorButtonText: {
        fontSize: 16,
        color: '#333',
    },
    selectorModalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    selectorModal: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 10,
        maxHeight: Dimensions.get('window').height * 0.6,
    },
    selectorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        textAlign: 'center',
    },
    vehicleItem: {
        padding: 15,
    },
    selectedVehicleItem: {
        backgroundColor: '#f0f0f0',
    },
    vehicleItemText: {
        fontSize: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
    cancelButton: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
});

export default HomeScreen;
