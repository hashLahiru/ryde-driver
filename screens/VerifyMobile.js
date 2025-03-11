import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Modal } from 'react-native';

export default function VerifyMobileScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '']); // Store individual code digits
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };

  const handleSubmit = () => {
    const verificationCode = code.join('');
    console.log('Verification Code:', verificationCode);
    // Handle the verification logic here

    // After verification, show the success modal
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate('UploadScreen'); // Navigate to MapScreen after closing the modal
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Verify Mobile Number</Text>
        <Text style={styles.subtitle}>Enter the 4-digit verification code sent to your phone.</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Verification Code</Text>

        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSubmit} // Show modal on verify
        >
          <Text style={styles.nextButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Verification Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login Successful</Text>
            <Text style={styles.modalMessage}>You have successfully verified your phone number!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose} // Close modal and navigate to MapScreen
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light gray background
  },
  header: {
    backgroundColor: '#FFC107', // Dark green header background
    borderBottomRightRadius: 40,
    padding: 25,
    paddingTop: 60,
    height: 180,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    lineHeight: 22,
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 30,
  },
  input: {
    width: 50,
    height: 50,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: '#FFC107', // Matching the dark green button color
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    height: 50,
    width: 300,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#eaeaea', // Gray button to indicate "Back"
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15, // Space between buttons
    height: 50,
    width: 300,
  },
  backButtonText: {
    color: '#666666', // Dark text for the back button
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#FFC107', // Button color
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
