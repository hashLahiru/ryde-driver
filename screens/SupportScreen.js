import React from 'react';
import {
 View,
 Text,
 StyleSheet,
 ScrollView,
 TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SupportScreen = () => {
 const navigation = useNavigation();

 return (
  <ScrollView style={styles.container}>
   {/* Header Section */}
   <View style={styles.header}>
    <TouchableOpacity
     onPress={() => navigation.goBack()}
     style={styles.iconButton}
    >
     <MaterialIcons name="arrow-back" size={28} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Support</Text>
   </View>

   {/* Support Section */}
   <View style={styles.supportSection}>
    <Text style={styles.sectionTitle}>How can we help you?</Text>

    {/* Support Options */}
    <TouchableOpacity style={styles.supportItem}>
     <MaterialIcons name="help" size={24} color="#FFC107" />
     <Text style={styles.supportText}>FAQ</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.supportItem}>
     <MaterialIcons name="chat" size={24} color="#FFC107" />
     <Text style={styles.supportText}>Live Chat</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.supportItem}>
     <MaterialIcons name="phone" size={24} color="#FFC107" />
     <Text style={styles.supportText}>Call Support</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.supportItem}>
     <MaterialIcons name="email" size={24} color="#FFC107" />
     <Text style={styles.supportText}>Email Support</Text>
    </TouchableOpacity>
   </View>
  </ScrollView>
 );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
 },
 header: {
  backgroundColor: '#FFC107', // Orange header background
  padding: 25,
  height: 120,
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomRightRadius: 40,
  paddingTop: 30,
 },
 iconButton: {
  padding: 5,
 },
 headerTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  marginLeft: 15,
 },
 supportSection: {
  marginTop: 30,
  paddingHorizontal: 20,
 },
 sectionTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 15,
 },
 supportItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  padding: 15,
  marginBottom: 10,
  borderRadius: 8,
 },
 supportText: {
  marginLeft: 15,
  fontSize: 18,
  color: '#333',
 },
});

export default SupportScreen;
