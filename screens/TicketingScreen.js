import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TicketingScreen = ({ navigation }) => {
    const [selectedIssueType, setSelectedIssueType] = useState('sales');
    const [showIssueSelector, setShowIssueSelector] = useState(false);
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [issues, setIssues] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const issueTypes = [
        { label: 'Sales', value: 'sales' },
        { label: 'Technical', value: 'technical' },
        { label: 'Other', value: 'other' },
    ];

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleSubmit = async () => {
        const login_token = await AsyncStorage.getItem('login_token');

        if (!note.trim()) {
            setModalMessage('Please describe your issue');
            setModalVisible(true);
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                'http://ryde100.introps.com/Driver/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function: 'SubmitIssue',
                        data: {
                            login_token: login_token,
                            issue_type: selectedIssueType,
                            issue_note: note,
                        },
                    }),
                }
            );

            const result = await response.json();

            if (result.status === 'success') {
                setModalMessage('Issue submitted successfully!');
                setModalVisible(true);
                setNote('');
                fetchIssues(); // Refresh issues list after submission
            } else {
                if (result.message) {
                    setModalMessage(result.message);
                } else {
                    setModalMessage('Please describe your issue');
                }
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            setModalMessage('An error occurred while submitting the issue');
            setModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchIssues = async () => {
        const login_token = await AsyncStorage.getItem('login_token');

        setIsFetching(true);
        try {
            const response = await fetch(
                'http://ryde100.introps.com/Driver/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        function: 'GetIssueList',
                        data: {
                            login_token: login_token,
                        },
                    }),
                }
            );

            const result = await response.json();
            if (result.status === 'success') {
                const formattedIssues = result.data.map((issue) => ({
                    id: issue.issue_id,
                    dateTime: formatDateTime(issue.created_at),
                    issueType: capitalizeFirstLetter(issue.issue_type),
                    note: issue.issue_note,
                    status: capitalizeFirstLetter(issue.issue_status),
                }));
                setIssues(formattedIssues);
            } else {
                if (result.message) {
                    setModalMessage(result.message);
                } else {
                    setModalMessage('Failed to fetch issues');
                }
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
            setModalMessage('An error occurred while fetching issues');
            setModalVisible(true);
        } finally {
            setIsFetching(false);
        }
    };

    // Helper function to format date
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Helper function to capitalize first letter
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons
                            name="arrow-back"
                            size={28}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report an Issue</Text>
                </View>
            </View>

            {/* Issue Reporting Form */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Submit a New Issue</Text>

                {/* Dropdown with Modal */}
                <View style={styles.row}>
                    <Text style={styles.label}>Issue Type:</Text>
                    <TouchableOpacity
                        style={styles.selectorButton}
                        onPress={() => setShowIssueSelector(true)}
                    >
                        <Text style={styles.selectorButtonText}>
                            {
                                issueTypes.find(
                                    (item) => item.value === selectedIssueType
                                )?.label
                            }
                        </Text>
                        <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showIssueSelector}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowIssueSelector(false)}
                >
                    <View style={styles.selectorModalContainer}>
                        <View style={styles.selectorModal}>
                            <Text style={styles.selectorTitle}>
                                Select Issue Type
                            </Text>
                            <FlatList
                                data={issueTypes}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => {
                                            setSelectedIssueType(item.value);
                                            setShowIssueSelector(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                <View style={styles.row}>
                    <Text style={styles.label}>Note:</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Describe your issue..."
                        value={note}
                        onChangeText={(text) => setNote(text)}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Issue List */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Issue List</Text>
                {isFetching ? (
                    <ActivityIndicator
                        size="large"
                        color="#FFC107"
                        style={styles.loadingIndicator}
                    />
                ) : issues.length > 0 ? (
                    issues.map((issue) => (
                        <View key={issue.id} style={styles.issueRow}>
                            <View style={styles.issueItem}>
                                <Text style={styles.issueText}>
                                    ID: {issue.id}
                                </Text>
                                <Text style={styles.issueText}>
                                    Date: {issue.dateTime}
                                </Text>
                                <Text style={styles.issueText}>
                                    Type: {issue.issueType}
                                </Text>
                                <Text style={styles.issueText}>
                                    Note: {issue.note}
                                </Text>
                                <Text
                                    style={[
                                        styles.issueText,
                                        issue.status === 'Open'
                                            ? styles.statusOpen
                                            : styles.statusClosed,
                                    ]}
                                >
                                    Status: {issue.status}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noIssuesText}>No issues found</Text>
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalMessage}</Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        width: '100%',
    },
    header: {
        backgroundColor: '#FFC107',
        borderBottomRightRadius: 50,
        padding: 20,
        paddingTop: 50,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    backIcon: {
        marginRight: 10,
        color: 'white',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        marginTop: 10,
        marginHorizontal: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    textInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#FFC107',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    issueRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    issueItem: {
        paddingBottom: 10,
    },
    issueText: {
        fontSize: 14,
        color: '#555',
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
    },
    selectorButtonText: {
        fontSize: 16,
        color: '#000',
    },
    selectorModalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    selectorModal: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        padding: 20,
    },
    selectorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
    },
    noIssuesText: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 20,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    statusOpen: {
        color: '#FFA000', // Amber color for open status
        fontWeight: 'bold',
    },
    statusClosed: {
        color: '#4CAF50', // Green color for closed status
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
});

export default TicketingScreen;
