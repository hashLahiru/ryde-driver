import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Fixed import

const TicketingScreen = ({ navigation }) => {
  const [selectedIssueType, setSelectedIssueType] = useState('sales');
  const [note, setNote] = useState('');

  // Dummy issue list for display
  const issues = [
    {
      id: 'ISSUE001',
      dateTime: 'Jan 20, 2025 2:00 PM',
      issueType: 'Sales',
      note: 'Driver had difficulty finding the location.',
      status: 'Open',
    },
    {
      id: 'ISSUE002',
      dateTime: 'Jan 22, 2025 5:30 PM',
      issueType: 'Technical',
      note: 'App crashed during booking.',
      status: 'Closed',
    },
  ];

  const handleSubmit = () => {
    alert('Issue submitted successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Issue</Text>
        </View>
      </View>

      {/* Issue Reporting Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Submit a New Issue</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Issue Type:</Text>
          <Picker
            selectedValue={selectedIssueType}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedIssueType(itemValue)}
          >
            <Picker.Item label="Sales" value="sales" />
            <Picker.Item label="Technical" value="technical" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
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
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Issue List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Issue List</Text>
        {issues.map((issue) => (
          <View key={issue.id} style={styles.issueRow}>
            <View style={styles.issueItem}>
              <Text style={styles.issueText}>ID: {issue.id}</Text>
              <Text style={styles.issueText}>Date: {issue.dateTime}</Text>
              <Text style={styles.issueText}>Type: {issue.issueType}</Text>
              <Text style={styles.issueText}>Note: {issue.note}</Text>
              <Text style={styles.issueText}>Status: {issue.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
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
    marginBottom: 0,
    color: 'white'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 0,
    marginTop: 0,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop:10,
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
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
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
});

export default TicketingScreen;
