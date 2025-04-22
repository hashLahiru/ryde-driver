import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SingleTripViewScreen = ({ route, navigation }) => {
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
                    <Text style={styles.value}>{trip.startTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>End Time:</Text>
                    <Text style={styles.value}>{trip.endTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Pickup :</Text>
                    <Text style={styles.value}>{trip.pickup}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Drop:</Text>
                    <Text style={styles.value}>{trip.drop}</Text>
                </View>
            </View>

            {/* Driver Details */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Driver Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{trip.driver.name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.value}>{trip.driver.phone}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Car:</Text>
                    <Text style={styles.value}>{trip.driver.car}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>License Plate:</Text>
                    <Text style={styles.value}>{trip.driver.licensePlate}</Text>
                </View>
            </View>

            {/* Trip Cost in a separate container (move it up) */}
            <View style={styles.costContainer}>
                <Text style={styles.cardTitle}>Trip Cost</Text>
                <Text style={styles.costValue}>{trip.cost}</Text>
            </View>

            {/* Action Button */}
            <TouchableOpacity
                style={styles.contactButton}
                onPress={() => alert('Contacting driver...')}
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
        fontSize: 40,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 180,
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
});

export default SingleTripViewScreen;
