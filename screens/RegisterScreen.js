import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Modal,
    FlatList,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: 'LK',
        name: 'Sri Lanka',
        flag: '🇱🇰',
        dialCode: '+94',
    });

    const countries = [
        { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
        { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
        { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
        { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
        {
            code: 'AE',
            name: 'United Arab Emirates',
            flag: '🇦🇪',
            dialCode: '+971',
        },
    ];

    const handleRegister = async () => {
        // Combine country code with phone number
        const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;

        try {
            const requestBody = {
                function: 'CreateDriver',
                data: {
                    mobile: fullPhoneNumber, // Use the combined phone number
                    email: email,
                    password: password,
                    firstname: firstName,
                    lastname: lastName,
                    address: address,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/Driver/app_api',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                await AsyncStorage.setItem('login_token', result.login_token);
                setModalMessage('Your account has been successfully created!');
                setIsSuccess(true);
            } else {
                setModalMessage(
                    result.message || 'Registration Failed. Please Try Again'
                );
                setIsSuccess(false);
            }
        } catch (error) {
            setModalMessage('Error Registering: ' + error.message);
            setIsSuccess(false);
        } finally {
            setModalVisible(true);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>
                    Join us to explore endless possibilities. Enter your details
                    to get started!
                </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Register with your Details</Text>

                {/* First Name Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                {/* Last Name Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />

                {/* Email Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                {/* Phone Number Input with Country Code */}
                <View style={styles.phoneInputContainer}>
                    {/* Country Code Selector */}
                    <TouchableOpacity
                        style={styles.countryCodeButton}
                        onPress={() => setShowCountryPicker(true)}
                    >
                        <Text style={styles.countryFlag}>
                            {selectedCountry.flag}
                        </Text>
                        <Text style={styles.countryCodeText}>
                            {selectedCountry.dialCode}
                        </Text>
                    </TouchableOpacity>

                    {/* Phone Number Input */}
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Address Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />

                {/* Password Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Register Button */}
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>Register</Text>
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
                    <Text style={styles.linkText}>
                        Already have an account? Sign In
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Country Picker Modal */}
            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.countryPickerModal}>
                    <View style={styles.countryPickerHeader}>
                        <Text style={styles.countryPickerTitle}>
                            Select Country
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(false)}
                        >
                            <Text style={styles.countryPickerDone}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={countries}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.countryItem,
                                    selectedCountry.code === item.code &&
                                        styles.selectedCountryItem,
                                ]}
                                onPress={() => {
                                    setSelectedCountry(item);
                                    setShowCountryPicker(false);
                                }}
                            >
                                <Text style={styles.countryItemFlag}>
                                    {item.flag}
                                </Text>
                                <Text style={styles.countryItemName}>
                                    {item.name}
                                </Text>
                                <Text style={styles.countryItemCode}>
                                    {item.dialCode}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>

            {/* Registration Success Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {isSuccess
                                ? 'Registration Successful'
                                : 'Registration Failed'}
                        </Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                if (isSuccess)
                                    navigation.replace('VerifyMobile');
                            }}
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
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: -1, // Remove double border
    },
    countryFlag: {
        fontSize: 20,
        marginRight: 5,
    },
    countryCodeText: {
        fontSize: 16,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    registerButton: {
        backgroundColor: '#FFC107',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
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
    // Country Picker Modal Styles
    countryPickerModal: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 100,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    countryPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    countryPickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countryPickerDone: {
        color: '#FFC107',
        fontSize: 16,
        fontWeight: 'bold',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    selectedCountryItem: {
        backgroundColor: '#FFF9E6',
    },
    countryItemFlag: {
        fontSize: 20,
        width: 30,
    },
    countryItemName: {
        flex: 1,
        fontSize: 16,
    },
    countryItemCode: {
        fontSize: 16,
        color: '#666',
    },
    // Registration Modal Styles
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
