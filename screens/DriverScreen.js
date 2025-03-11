import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const DriverScreen = ({ navigation }) => {
  const [activeRide, setActiveRide] = useState({
    destination: 'Downtown City Center',
    distance: '5.2 km',
    time: '15 mins',
    fare: '$12.50',
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            accessibilityLabel="Menu"
          >
            <MaterialIcons name="menu" size={28} style={styles.menuIcon} />
          </TouchableOpacity>
          <Image
          //  source={require('../assets/images/adaptive-icon.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Welcome Driver</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationsScreen')}
          accessibilityLabel="Notifications"
        >
          <MaterialIcons name="notifications-none" size={28} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.container}>
        {/* Active Ride */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Ride</Text>
          {activeRide ? (
            <View style={styles.activeRideDetails}>
              <Text style={styles.detailText}>Destination: {activeRide.destination}</Text>
              <Text style={styles.detailText}>Distance: {activeRide.distance}</Text>
              <Text style={styles.detailText}>Estimated Time: {activeRide.time}</Text>
              <Text style={styles.detailText}>Fare: {activeRide.fare}</Text>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Complete Ride</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noActiveRideText}>No active rides</Text>
          )}
        </View>

        {/* Scheduled Rides */}
        <Text style={styles.sectionTitle}>Scheduled Rides</Text>
        {[1, 2, 3].map((ride, index) => (
          <View key={index} style={styles.scheduledRideCard}>
            <FontAwesome name="calendar" size={24} color="#333333" />
            <View style={styles.scheduledRideInfo}>
              <Text style={styles.detailText}>Destination: City Mall</Text>
              <Text style={styles.detailText}>Pickup Time: 2:30 PM</Text>
              <Text style={styles.detailText}>Fare: $15.00</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#333333" />
          </View>
        ))}

        {/* Earnings Summary */}
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <View style={styles.card}>
          <Text style={styles.earningsText}>Today's Earnings: $75.00</Text>
          <Text style={styles.earningsText}>Weekly Earnings: $450.00</Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Add Ride Button */}
        <TouchableOpacity style={styles.addRideButton}>
          <MaterialIcons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addRideText}>Add Ride</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: -25
  },
  notificationIcon: {
    color: '#333333',
  },
  menuIcon: {
    color: '#333333',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  activeRideDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#ff9600',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  noActiveRideText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  scheduledRideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduledRideInfo: {
    flex: 1,
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#ff9600',
    fontWeight: '600',
  },
  earningsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  addRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9600',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
  },
  addRideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default DriverScreen;
