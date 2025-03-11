import React, { useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

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
            <MaterialIcons name="menu" size={30} style={styles.menuIcon} />
          </TouchableOpacity>
          <Text style={styles.logoText}>Ryde.lk</Text>
          <View style={styles.onlineStatus}>
            <Text style={styles.onlineStatusText}>{isOnline ? 'Online' : 'Offline'}</Text>
            <Switch
              value={isOnline}
              onValueChange={() => setIsOnline((prev) => !prev)}
              trackColor={{ false: '#999', true: 'black' }}
              thumbColor={isOnline ? '#fff' : '#fff'}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
            <MaterialIcons name="notifications-none" size={28} style={styles.notificationIcon} />
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
            <Image source={require('../assets/images/adaptive-icon.png')} style={styles.sideMenuLogo} />
            <Text style={styles.sideMenuTitle}>Ryde.lk</Text>
          </View>
          <View style={styles.menuItemsContainer}>
            {['Dashboard', 'Earnings', 'History', 'Profile', 'Support', 'Logout'].map((item, index) => (
              <Text key={index} style={styles.menuItem} onPress={() => handleMenuItemClick(item)}>
                {item}
              </Text>
            ))}
          </View>
          <View style={styles.sideMenuFooter}>
            <Text style={styles.footerText}>Powered by Introps IT</Text>
          </View>
        </View>
      </Modal>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Driver Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Active Rides</Text>
          </View>
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
          <Text style={styles.rideDetail}>Pickup: 123 Main Street</Text>
          <Text style={styles.rideDetail}>Dropoff: Central Park</Text>
          <View style={styles.startRideButton}>
            <Text style={styles.startRideText}>View Ride</Text>
          </View>
        </TouchableOpacity>

        {/* Earnings Summary */}
        <Text style={styles.sectionTitle}>Earnings Summary</Text>
        <View style={styles.earningsCard}>
          <Text style={styles.earningsText}>Weekly Earnings: $560</Text>
          <Text style={styles.earningsText}>Monthly Earnings: $2400</Text>
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate('SupportScreen')}>
          <MaterialIcons name="support-agent" size={24} color="#fff" />
          <Text style={styles.supportText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFC107',
    padding: 20,
    paddingTop: 40,
    height: 150,
    borderBottomRightRadius: 50,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 80,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 0,
  },
  sideMenu: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
    width: '70%',
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sideMenuLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  sideMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuItemsContainer: {
    flex: 1,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 15,
    color: '#fff',
  },
  sideMenuFooter: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#999999',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  currentRideCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rideDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  startRideButton: {
    marginTop: 10,
    backgroundColor: '#FFC107',
    padding: 10,
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  startRideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earningsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  earningsText: {
    fontSize: 14,
    color: '#555',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  supportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;
