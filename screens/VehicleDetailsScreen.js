import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const VehicleDetailsScreen = () => {
  const navigation = useNavigation(); // Access navigation instance

  const [vehicleModel, setVehicleModel] = useState('');
  const [registrationImage, setRegistrationImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]); // Store multiple vehicle images

  const validateVehicleModel = (text) => {
    const isValid = /^[a-zA-Z0-9\s]{3,}$/.test(text); // Only allows letters, numbers, and spaces (min 3 chars)
    return isValid;
  };

  const pickImage = async (setImageCallback) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageCallback(result.assets[0].uri);
    }
  };

  const pickMultipleImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setVehicleImages([...vehicleImages, ...selectedImages]);
    }
  };

  const handleSubmit = () => {
    if (vehicleModel && registrationImage && insuranceImage && vehicleImages.length > 0) {
      Alert.alert('Success', 'Vehicle details saved successfully!');
    } else {
      Alert.alert('Error', 'Please complete all fields and upload all required documents.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Vehicle Model */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vehicle Model</Text>
            <MaterialIcons name="directions-car" size={24} color="#FFC107" />
          </View>
          <TextInput
            placeholder="Enter Vehicle Model (e.g., Toyota Prius 2018)"
            style={styles.input}
            value={vehicleModel}
            onChangeText={(text) => {
              if (validateVehicleModel(text)) {
                setVehicleModel(text);
              }
            }}
          />
          {!validateVehicleModel(vehicleModel) && vehicleModel.length > 0 && (
            <Text style={styles.errorText}>Enter a valid model (min 3 characters, no special symbols).</Text>
          )}
        </View>

        {/* Vehicle Registration Image */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Vehicle Registration</Text>
            <TouchableOpacity onPress={() => pickImage(setRegistrationImage)} style={styles.cameraButton}>
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={registrationImage ? 'gray' : '#c9c9c9'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText}>Upload the official vehicle registration certificate.</Text>
          {registrationImage && <Image source={{ uri: registrationImage }} style={styles.imagePreview} />}
        </View>

        {/* Insurance Document Image */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Insurance Document</Text>
            <TouchableOpacity onPress={() => pickImage(setInsuranceImage)} style={styles.cameraButton}>
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={insuranceImage ? 'gray' : '#c9c9c9'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText}>Upload proof of vehicle insurance.</Text>
          {insuranceImage && <Image source={{ uri: insuranceImage }} style={styles.imagePreview} />}
        </View>

        {/* Import Vehicle Images */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Import Vehicle Images</Text>
            <TouchableOpacity onPress={pickMultipleImages} style={styles.cameraButton}>
              <MaterialIcons name="photo-camera" size={24} color="#c9c9c9" />
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText}>Upload multiple images of your vehicle.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {vehicleImages.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.imagePreviewSmall} />
            ))}
          </ScrollView>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: vehicleModel && registrationImage && insuranceImage && vehicleImages.length > 0 ? '#FFC107' : '#ccc' },
          ]}
          onPress={handleSubmit}
          disabled={!vehicleModel || !registrationImage || !insuranceImage || vehicleImages.length === 0}
        >
          <Text style={styles.submitButtonText}>Save Vehicle Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFC107',
    borderBottomRightRadius: 50,
    padding: 20,
    paddingTop: 20,
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 10,
    marginBottom: 70
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: -20,
    marginTop: 70
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  cameraButton: {
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  imagePreviewSmall: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  imageScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VehicleDetailsScreen;
