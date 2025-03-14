import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 StyleSheet,
 TouchableOpacity,
 KeyboardAvoidingView,
 Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginOtpScreen({ navigation }) {
 const [code, setCode] = useState(['', '', '', '']); // Updated for 4-digit OTP
 const [modalVisible, setModalVisible] = useState(false);
 const [modalMessage, setModalMessage] = useState('');

 const handleChange = (text, index) => {
  const newCode = [...code];
  newCode[index] = text;
  setCode(newCode);
 };

 const handleSubmit = async () => {
  const verificationCode = code.join('');
  console.log('Verification Code:', verificationCode);

  const mobile = await AsyncStorage.getItem('phoneNumber');
  console.log('Phone Number:', mobile);

  if (mobile) {
   try {
    const requestBody = {
     function: 'VerifyLoginOtp',
     data: {
      mobile: mobile,
      otp: verificationCode,
     },
    };

    const response = await fetch(
     'http://ryde100.introps.com/App_apiv2/app_api',
     {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
     }
    );

    if (!response.ok) {
     throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response from API:', result);

    if (result.status === 'success') {
     setModalMessage('You have successfully verified your phone number!');
     setModalVisible(true);
    } else {
     setModalMessage('OTP is incorrect. Please try again.');
     setModalVisible(true);
    }
   } catch (error) {
    setModalMessage('An error occurred. Please try again.');
    setModalVisible(true);
   }
  } else {
   setModalMessage('Token or mobile number not found. Please login again.');
   setModalVisible(true);
  }
 };

 const handleModalClose = () => {
  setModalVisible(false);
  if (modalMessage === 'You have successfully verified your phone number!') {
   navigation.navigate('Home');
  }
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior="padding">
   <View style={styles.header}>
    <Text style={styles.title}>Verify Mobile Number</Text>
    <Text style={styles.subtitle}>
     Enter the 4-digit verification code sent to your phone.
    </Text>
   </View>

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

    <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
     <Text style={styles.nextButtonText}>Verify</Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={styles.backButton}
     onPress={() => navigation.goBack()}
    >
     <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
   </View>

   <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={handleModalClose}
   >
    <View style={styles.modalContainer}>
     <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
       {modalMessage.includes('successfully')
        ? 'Login Successful'
        : 'Verification Failed'}
      </Text>
      <Text style={styles.modalMessage}>{modalMessage}</Text>
      <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
       <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
     </View>
    </View>
   </Modal>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#f5f5f5' },
 header: {
  backgroundColor: '#ff9600',
  borderBottomRightRadius: 40,
  padding: 25,
  paddingTop: 60,
  height: 180,
 },
 title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
 subtitle: { color: '#fff', fontSize: 16, marginTop: 15, lineHeight: 22 },
 inputContainer: { flex: 1, padding: 20, alignItems: 'center' },
 label: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
 codeInputContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '60%',
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
  backgroundColor: '#ff9600',
  paddingVertical: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 30,
  height: 50,
  width: 300,
 },
 nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
 backButton: {
  backgroundColor: '#eaeaea',
  paddingVertical: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 15,
  height: 50,
  width: 300,
 },
 backButtonText: { color: '#666666', fontSize: 18, fontWeight: 'bold' },
 modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
 },
 modalContent: {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 10,
  alignItems: 'center',
  width: '80%',
 },
 modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
 modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
 modalButton: {
  backgroundColor: '#ff9600',
  paddingVertical: 10,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center',
 },
 modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
