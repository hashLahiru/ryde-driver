import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 StyleSheet,
 TouchableOpacity,
 KeyboardAvoidingView,
 Modal,
 ScrollView,
 TouchableWithoutFeedback,
 Keyboard,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
 const [fullName, setFullName] = useState('');
 const [email, setEmail] = useState('');
 const [phoneNumber, setPhoneNumber] = useState('');
 const [address, setAddress] = useState('');
 const [password, setPassword] = useState('');
 const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility

 const handleRegister = () => {
  setModalVisible(true); // Show modal after registration
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior="padding">
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
     {/* Header Section */}
     <View style={styles.header}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>
       Join us to explore endless possibilities. Enter your details to get
       started!
      </Text>
     </View>

     {/* Input Section */}
     <View style={styles.inputContainer}>
      <Text style={styles.label}>Register with your Details</Text>

      <TextInput
       style={styles.textInput}
       placeholder="Full Name"
       value={fullName}
       onChangeText={setFullName}
      />

      <TextInput
       style={styles.textInput}
       placeholder="Email Address"
       value={email}
       onChangeText={setEmail}
       keyboardType="email-address"
      />

      <TextInput
       style={styles.textInput}
       placeholder="Phone Number"
       value={phoneNumber}
       onChangeText={setPhoneNumber}
       keyboardType="phone-pad"
      />

      <TextInput
       style={styles.textInput}
       placeholder="Address"
       value={address}
       onChangeText={setAddress}
      />

      <TextInput
       style={styles.textInput}
       placeholder="Password"
       value={password}
       onChangeText={setPassword}
       secureTextEntry
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleRegister}>
       <Text style={styles.nextButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
       style={styles.cancelButton}
       onPress={() => navigation.goBack()}
      >
       <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      {/* Already have an account? */}
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
       <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
     </View>
    </ScrollView>
   </TouchableWithoutFeedback>

   {/* Registration Success Modal */}
   <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
   >
    <View style={styles.modalContainer}>
     <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Registration Successful</Text>
      <Text style={styles.modalMessage}>
       Your account has been successfully created!
      </Text>
      <TouchableOpacity
       style={styles.modalButton}
       onPress={() => setModalVisible(false)}
      >
       <Text style={styles.modalButtonText}>Close</Text>
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
  backgroundColor: '#fff',
 },
 scrollContainer: {
  flexGrow: 1,
  paddingBottom: 20,
 },
 header: {
  backgroundColor: '#FFC107',
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
 textInput: {
  height: 50,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  paddingHorizontal: 10,
  marginBottom: 15,
  backgroundColor: '#f9f9f9',
 },
 nextButton: {
  backgroundColor: '#FFC107',
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: 'center',
  height: 50,
 },
 nextButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
 },
 cancelButton: {
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 0,
  height: 50,
 },
 cancelButtonText: {
  color: '#666666',
  fontSize: 16,
  fontWeight: 'bold',
 },
 linkText: {
  color: '#FFC107',
  fontSize: 14,
  textAlign: 'center',
  marginTop: 15,
 },
 // Modal Styles
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
  backgroundColor: '#FFC107',
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
