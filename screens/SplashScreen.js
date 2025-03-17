import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
 useEffect(() => {
  setTimeout(() => {
   navigation?.replace('Onboarding1');
  }, 3000); // Navigate to Onboarding1 after 3 seconds
 }, []);

 return (
  <View style={styles.container}>
   {/* Logo */}
   <Image source={require('../assets/images/icon.png')} style={styles.logo} />
   {/* App Name */}
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFC107',
 },
 logo: {
  width: 120, // Adjust the width as needed
  height: 120, // Adjust the height as needed
  //marginBottom: 0, // Add spacing between the logo and text
 },
 text: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#ffffff',
 },
});
