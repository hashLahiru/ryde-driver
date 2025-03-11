import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DriverScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/user-avatar.png')} // Replace with the driver avatar image
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.userLocation}>Location: Downtown</Text>
          </View>
        </View>
      </View>

      {/* Car Image Section */}
      <View style={styles.carImageSection}>
        <Image
          source={require('../assets/images/bcar.png')} // Replace with the car image file
          style={styles.carImage}
        />
        <Text style={styles.carText}>Car Model: Toyota Prius 2022</Text>
        <Text style={styles.carText}>License Plate: ABC-1234</Text>
      </View>

      {/* Driver Options */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="history" size={24} color="#666666" />
          <Text style={styles.optionText}>Ride History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="payment" size={24} color="#666666" />
          <Text style={styles.optionText}>Payment Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="settings" size={24} color="#666666" />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#666666" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'White', // Header background
    padding: 25,
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 40,
    paddingTop: 30,
  },
  iconButton: {
    padding: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  profileImage: {
    width: 60, // Reduced avatar size
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  userLocation: {
    fontSize: 14,
    color: 'gray',
  },
  carImageSection: {
    alignItems: 'center',
    backgroundColor: '#FFC107',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  carImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  carText: {
    fontSize: 16,
    color: '#333',
  },
  optionsSection: {
    marginHorizontal: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  optionText: {
    marginLeft: 15,
    color: '#666666',
    fontSize: 18,
  },
});

export default DriverScreen;
