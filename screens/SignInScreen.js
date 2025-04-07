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
    FlatList,
    Alert,
    Modal,
    Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+92');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showPicker, setShowPicker] = useState(false);

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
                setModalMessage('OTP sent successfully!');
                setModalVisible(true);
                await AsyncStorage.setItem('phoneNumber', phone);
                navigation.navigate('LoginOtp', { phoneNumber: phone });
            } else {
                setModalMessage('Failed to send OTP. Please try again.');
                setModalVisible(true);
            }
        } catch (error) {
            console.error(error);
            setModalMessage('An error occurred while sending OTP.');
            setModalVisible(true);
        }
    };

    // Handle Phone Submit (send OTP and save number to AsyncStorage)
    const handlePhoneSubmit = () => {
        if (phoneNumber && selectedCountryCode) {
            const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
            console.log('Full Phone Number:', fullPhoneNumber);
            sendOtp(fullPhoneNumber);
        } else {
            alert('Please enter a valid phone number.');
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (modalMessage.includes('OTP has been sent')) {
            navigation.navigate('LoginOtp', { phoneNumber: otpPhone });
        }
    };

    const selectedCountry =
        countries.find((c) => c.dialCode === selectedCountryCode) ||
        countries[0];

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Welcome back!</Text>
                <Text style={styles.subtitle}>
                    Lorem ipsum dolor sit amet consectetur. Ac ipsum risus quis
                    donec vitae.
                </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Login with your Phone Number</Text>
                <View style={styles.phoneInput}>
                    {/* Country Picker */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.pickerContainer}>
                            {Platform.OS === 'ios' ? (
                                <>
                                    <TouchableOpacity
                                        style={styles.countryCodeButton}
                                        onPress={() => setShowPicker(true)}
                                    >
                                        <View
                                            style={styles.countryInfoContainer}
                                        >
                                            <Text style={styles.countryFlag}>
                                                {selectedCountry.flag}
                                            </Text>
                                            <Text
                                                style={styles.countryCodeText}
                                            >
                                                {selectedCountry.dialCode}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <Modal
                                        visible={showPicker}
                                        transparent={true}
                                        animationType="slide"
                                    >
                                        <View
                                            style={
                                                styles.customPickerModalContainer
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.customPickerHeader
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.customPickerTitle
                                                    }
                                                >
                                                    Select Country
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setShowPicker(false)
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.customPickerDone
                                                        }
                                                    >
                                                        Done
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <FlatList
                                                data={countries}
                                                keyExtractor={(item) =>
                                                    item.code
                                                }
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.countryItem,
                                                            selectedCountryCode ===
                                                                item.dialCode &&
                                                                styles.selectedCountryItem,
                                                        ]}
                                                        onPress={() => {
                                                            setSelectedCountryCode(
                                                                item.dialCode
                                                            );
                                                            setShowPicker(
                                                                false
                                                            );
                                                        }}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.countryFlag
                                                            }
                                                        >
                                                            {item.flag}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.countryName
                                                            }
                                                        >
                                                            {item.name}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.countryDialCode
                                                            }
                                                        >
                                                            {item.dialCode}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    </Modal>
                                </>
                            ) : (
                                <Picker
                                    selectedValue={selectedCountryCode}
                                    style={styles.picker}
                                    onValueChange={(itemValue) =>
                                        setSelectedCountryCode(itemValue)
                                    }
                                >
                                    {countries.map((country) => (
                                        <Picker.Item
                                            key={country.code}
                                            label={`${country.flag} ${country.name} (${country.dialCode})`}
                                            value={country.dialCode}
                                        />
                                    ))}
                                </Picker>
                            )}
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
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handlePhoneSubmit}
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Message</Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleModalClose}
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
        height: 50, // Fixed height for consistent alignment
    },
    pickerContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        flex: 1,
        height: 50,
        backgroundColor: '#f9f9f9',
        ...Platform.select({
            ios: {
                width: 120, // Give it enough width to display the full country code
            },
        }),
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
    countryCodeButton: {
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        minWidth: 100, // Increased width to show more content
    },
    countryInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    countryFlag: {
        fontSize: 20,
        marginRight: 5,
    },
    countryCodeText: {
        fontSize: 16,
    },
    pickerModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', // Center the modal content
    },
    pickerModalContent: {
        backgroundColor: 'white',
    },
    pickerDoneButton: {
        padding: 15,
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    pickerDoneText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalPicker: {
        width: '100%',
    },
    pickerModalContent: {
        backgroundColor: 'white',
        width: '100%', // Ensure full width
        maxHeight: '60%', // Limit height
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    pickerItem: {
        fontSize: 16,
    },
    customPickerModalContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 100,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    customPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    customPickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    customPickerDone: {
        color: '#007AFF',
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
        backgroundColor: '#f0f0f0',
    },
    countryName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    countryDialCode: {
        color: '#666',
        fontSize: 14,
    },
});
