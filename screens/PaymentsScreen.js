import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PaymentsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      {/* Payment Options */}
      <View style={styles.paymentOptionsSection}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* Add your payment method options here */}
        <TouchableOpacity style={styles.paymentOption}>
          <MaterialIcons name="credit-card" size={24} color="#666666" />
          <Text style={styles.paymentOptionText}>Credit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#666666" />
          <Text style={styles.paymentOptionText}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption}>
          <MaterialIcons name="payment" size={24} color="#666666" />
          <Text style={styles.paymentOptionText}>PayPal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption}>
          <MaterialIcons name="money" size={24} color="#666666" />
          <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
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
    backgroundColor: '#ff9600', // Orange header background
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
  paymentOptionsSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  paymentOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default PaymentsScreen;
