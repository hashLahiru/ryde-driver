import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DriverDetailsScreen = ({ navigation }) => {
  const handleSubmit = () => {
    // Navigate to the Home screen after submission
    navigation.navigate('Home'); // Replace 'Home' with the exact route name of your Home screen
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Details</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container}>
        {/* Personal Details Section */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <MaterialIcons name="person" size={24} color="#FFC107" />
          </View>
          <Text style={styles.cardText}>Provide full name, contact, and address.</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PersonalDetailsScreen')}
          >
            <Text style={styles.actionButtonText}>Add Details</Text>
          </TouchableOpacity>
        </View>

        {/* License & Documents Section */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>License & Documents</Text>
            <MaterialIcons name="description" size={24} color="#FFC107" />
          </View>
          <Text style={styles.cardText}>
            Upload driver's license, insurance, and ID proof.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LicenseDocumentsScreen')}
          >
            <Text style={styles.actionButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Details Section */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vehicle Details</Text>
            <MaterialIcons name="directions-car" size={24} color="#FFC107" />
          </View>
          <Text style={styles.cardText}>
            Add vehicle information like model, color, and registration.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('VehicleDetailsScreen')}
          >
            <Text style={styles.actionButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFC107',
    borderBottomRightRadius: 50,
    padding: 20,
    paddingTop: 50,
    height: 130,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: -20,
  },
  sectionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#cccccc',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  submitButtonContainer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderTopColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#cccccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DriverDetailsScreen;
