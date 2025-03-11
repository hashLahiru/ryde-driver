import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon

const PersonalDetailsScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = () => {
    if (fullName && contactNumber && address && email && dob && gender && emergencyContact) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      Alert.alert('Success', 'Personal details saved successfully!');
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Personal Details</Text>
      </View>

      {/* Form Content */}
      <View style={styles.container}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={(text) => { setFullName(text); handleInputChange(); }}
        />
        <TextInput
          placeholder="Contact Number"
          style={styles.input}
          value={contactNumber}
          onChangeText={(text) => { setContactNumber(text); handleInputChange(); }}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Address"
          style={styles.input}
          value={address}
          onChangeText={(text) => { setAddress(text); handleInputChange(); }}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => { setEmail(text); handleInputChange(); }}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Date of Birth (DD/MM/YYYY)"
          style={styles.input}
          value={dob}
          onChangeText={(text) => { setDob(text); handleInputChange(); }}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => { setGender(itemValue); handleInputChange(); }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <TextInput
          placeholder="Emergency Contact Number"
          style={styles.input}
          value={emergencyContact}
          onChangeText={(text) => { setEmergencyContact(text); handleInputChange(); }}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: isFormValid ? '#FFC107' : '#ccc' }]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Save Details</Text>
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
    height: 180,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 10,
    marginBottom: 70
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: -30,
    marginTop: 80
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PersonalDetailsScreen;
