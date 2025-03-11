import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HistoryScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
      </View>

      {/* History List Section */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Your Recent Rides</Text>

        {/* Add your booking history items here */}
        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #1</Text>
          <Text style={styles.historyDate}>Date: Jan 1, 2025</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #2</Text>
          <Text style={styles.historyDate}>Date: Dec 25, 2024</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #3</Text>
          <Text style={styles.historyDate}>Date: Dec 15, 2024</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #3</Text>
          <Text style={styles.historyDate}>Date: Dec 15, 2024</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #3</Text>
          <Text style={styles.historyDate}>Date: Dec 15, 2024</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyItem}>
          <Text style={styles.historyTitle}>Booking #3</Text>
          <Text style={styles.historyDate}>Date: Dec 15, 2024</Text>
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
  historySection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDate: {
    fontSize: 16,
    color: '#666666',
  },
});

export default HistoryScreen;
