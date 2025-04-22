import React, { useState, useRef } from 'react';
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

export default function VerifyMobileScreen({ navigation }) {
    const [code, setCode] = useState(['', '', '', '']); // Store individual code digits
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [modalMessage, setModalMessage] = useState(''); // State for modal message
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        if (!/^\d?$/.test(text)) return; // Allow only numbers

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Move focus to the next input field
        if (text && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const verificationCode = code.join('');
        console.log(verificationCode);

        const token = await AsyncStorage.getItem('login_token');
        console.log('login token', token);

        if (token) {
            try {
                const requestBody = {
                    function: 'VerifyOtpDriver', // Updated function name
                    data: {
                        token: token,
                        otp: verificationCode,
                    },
                };

                const response = await fetch(
                    'http://ryde100.introps.com/Driver/app_api',
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

                if (result.status === 'success') {
                    setModalMessage(
                        'OTP verified successfully. Your account is now active.'
                    );
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
            setModalMessage('Token not found. Please login again.');
            setModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        if (
            modalMessage ===
            'OTP verified successfully. Your account is now active.'
        ) {
            navigation.navigate('Home'); // Navigate to Home on success
        }
    };

    const handleKeyPress = (event, index) => {
        if (
            event.nativeEvent.key === 'Backspace' &&
            index > 0 &&
            !code[index]
        ) {
            inputsRef.current[index - 1]?.focus();
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
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.input}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            returnKeyType="next"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleSubmit}
                >
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
                        <Text style={styles.modalTitle}>Verification</Text>
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#FFC107',
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
        backgroundColor: '#FFC107',
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
        backgroundColor: '#eaeaea',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
        height: 50,
        width: 300,
    },
    backButtonText: {
        color: '#666666',
        fontSize: 18,
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
