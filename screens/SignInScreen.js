import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 StyleSheet,
 TouchableOpacity,
 KeyboardAvoidingView,
 TouchableWithoutFeedback,
 Keyboard,
 Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigation }) {
 const [phoneNumber, setPhoneNumber] = useState('');
 const [selectedCountryCode, setSelectedCountryCode] = useState('+92');

 // Function to send OTP
 const sendOtp = async (phone) => {
  try {
   const response = await fetch(
    'http://ryde100.introps.com/App_apiv2/app_api',
    {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify({
      function: 'SendLoginOtp',
      data: {
       mobile: phone,
      },
     }),
    }
   );

   const data = await response.json();
   if (data && data.status === 'success') {
    Alert.alert('OTP Sent', 'An OTP has been sent to your phone number.');
    // Store the phone number in AsyncStorage for future use
    await AsyncStorage.setItem('phoneNumber', phone);
    navigation.navigate('LoginOtp', { phoneNumber: phone });
   } else {
    Alert.alert('Error', 'Failed to send OTP. Please try again.');
   }
  } catch (error) {
   Alert.alert('Error', 'An error occurred while sending OTP.');
   console.error(error);
  }
 };

 // Handle Phone Submit (send OTP and save number to AsyncStorage)
 const handlePhoneSubmit = () => {
  if (phoneNumber && selectedCountryCode) {
   const fullPhoneNumber = phoneNumber;
   sendOtp(fullPhoneNumber);
  } else {
   alert('Please enter a valid phone number.');
  }
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior="padding">
   {/* Header Section */}
   <View style={styles.header}>
    <Text style={styles.title}>Welcome back!</Text>
    <Text style={styles.subtitle}>
     Lorem ipsum dolor sit amet consectetur. Ac ipsum risus quis donec vitae.
    </Text>
   </View>

   {/* Input Section */}
   <View style={styles.inputContainer}>
    <Text style={styles.label}>Login with your Phone Number</Text>
    <View style={styles.phoneInput}>
     {/* Country Picker */}
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.pickerContainer}>
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
      </View>
     </TouchableWithoutFeedback>

     {/* Phone Number Input */}
     <TextInput
      style={styles.textInput}
      placeholder="Phone Number"
      keyboardType="phone-pad"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      maxLength={15} // Limit phone number length if needed
     />
    </View>

    {/* Next Button */}
    <TouchableOpacity style={styles.nextButton} onPress={handlePhoneSubmit}>
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
  backgroundColor: '#ff9600', // Green header background
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
 pickerContainer: {
  flex: 1,
  backgroundColor: '#f9f9f9',
 },
 picker: {
  flex: 1,
  height: 50,
  backgroundColor: '#f9f9f9',
 },
 textInput: {
  flex: 2,
  height: 50,
  paddingHorizontal: 10,
 },
 nextButton: {
  backgroundColor: '#ff9600', // Green button
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
