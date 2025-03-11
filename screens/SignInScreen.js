import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SignInScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+92');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet consectetur. Ac ipsum risus quis donec vitae. Velit nuncscelerisque a mauris quis.
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Login with your Phone Number</Text>
        <View style={styles.phoneInput}>
          {/* Country Picker */}
          <Picker
            selectedValue={selectedCountryCode}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCountryCode(itemValue)}
          >
            <Picker.Item label="🇵🇰 +92" value="+92" />
            <Picker.Item label="🇺🇸 +1" value="+1" />
            <Picker.Item label="🇮🇳 +91" value="+91" />
            {/* Add more countries as needed */}
          </Picker>

          {/* Phone Number Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('VerifyMobile')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFC107', // Green header background
    borderBottomRightRadius: 50,
    padding: 20,
    paddingTop: 50,
    height: 180,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  inputContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    width: 100,
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#FFC107', // Green button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
    marginBottom: 10, // Space between buttons
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#eaeaea', // Gray button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
  },
  backButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
