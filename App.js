import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Splash and Onboarding Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';

// Authentication Screens
import SignInScreen from './screens/SignInScreen';
import VerifyMobileScreen from './screens/VerifyMobile';
import RegisterScreen from './screens/RegisterScreen';
import LoginOtpScreen from './screens/LoginOtp';

// Main Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import DriverDetailsScreen from './screens/DriverDetailsScreen';

// Additional Screens (Side Menu Items)
import UserScreen from './screens/UserScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import HistoryScreen from './screens/HistoryScreen';
import SupportScreen from './screens/SupportScreen';
import DriverScreen from './screens/DriverScreen';
import PersonalDetailsScreen from './screens/PersonalDetailsScreen';
import LicenseDocumentsScreen from './screens/LicenseDocumentsScreen';
import VehicleDetailsScreen from './screens/VehicleDetailsScreen';
import SingleTripViewScreen from './screens/SingleTripViewScreen';
import TicketingScreen from './screens/TicketingScreen';

// Create Stack Navigator
const Stack = createStackNavigator();

export default function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(null);

 useEffect(() => {
  const checkLogginState = async () => {
   const token = await AsyncStorage.getItem('login_token');
   if (token) {
    setIsLoggedIn(true);
   } else {
    setIsLoggedIn(false);
   }
  };

  checkLogginState();
 }, []);

 if (isLoggedIn === null) {
  return <SplashScreen />;
 }

 return (
  <NavigationContainer>
   <Stack.Navigator
    initialRouteName={isLoggedIn ? 'Home' : 'Splash'} // Skip login if logged in
    screenOptions={{
     headerShown: false, // Globally hide headers for all screens
    }}
   >
    {/* Splash and Onboarding Screens */}
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
    <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />

    {/* Authentication Screens */}
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="LoginOtp" component={LoginOtpScreen} />

    {/* Main App Screens */}
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="UploadScreen" component={DriverDetailsScreen} />
    <Stack.Screen name="MapScreen" component={MapScreen} />

    {/* Side Menu Screens */}
    <Stack.Screen name="UserScreen" component={UserScreen} />
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
    <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    <Stack.Screen name="SupportScreen" component={SupportScreen} />
    <Stack.Screen name="DriverScreen" component={DriverScreen} />
    <Stack.Screen
     name="PersonalDetailsScreen"
     component={PersonalDetailsScreen}
    />
    <Stack.Screen
     name="LicenseDocumentsScreen"
     component={LicenseDocumentsScreen}
    />
    <Stack.Screen
     name="VehicleDetailsScreen"
     component={VehicleDetailsScreen}
    />
    <Stack.Screen
     name="SingleTripViewScreen"
     component={SingleTripViewScreen}
    />
    <Stack.Screen name="TicketingScreen" component={TicketingScreen} />
   </Stack.Navigator>
  </NavigationContainer>
 );
}
