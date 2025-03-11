import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsSection}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <TouchableOpacity style={styles.notificationItem}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.notificationText}>Your booking was confirmed!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationItem}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.notificationText}>Payment successful for your order.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationItem}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.notificationText}>You have a new message from support.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationItem}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.notificationText}>Don't forget to review your recent experience.</Text>
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
    backgroundColor: '#FFC107', // Orange header background
    padding: 25,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 40,
    paddingTop: 30,
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  notificationsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  notificationText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default NotificationsScreen;
