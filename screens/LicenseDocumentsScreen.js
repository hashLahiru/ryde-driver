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
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { useNavigation } from '@react-navigation/native'; // For navigation

const LicenseDocumentsScreen = () => {
  const navigation = useNavigation(); // Access navigation instance

  const [licenseNumber, setLicenseNumber] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [idProof, setIdProof] = useState('');
  const [images, setImages] = useState({
    license: null,
    insurance: null,
    idProof: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = () => {
    if (licenseNumber && insuranceNumber && idProof) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const pickImage = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages({ ...images, [field]: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      Alert.alert('Success', 'License and documents saved successfully!');
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Updated Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>License & Documents</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* License Number */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>License Number</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => pickImage('license')} style={styles.cameraButton}>
                <MaterialIcons
                  name="photo-camera"
                  size={24}
                  color={images.license ? 'gray' : '#c9c9c9'}
                />
              </TouchableOpacity>
              <MaterialIcons name="description" size={24} color="#FFC107" />
            </View>
          </View>
          <TextInput
            placeholder="Enter License Number"
            style={styles.input}
            value={licenseNumber}
            onChangeText={(text) => {
              setLicenseNumber(text);
              handleInputChange();
            }}
          />
          {images.license && <Image source={{ uri: images.license }} style={styles.imagePreview} />}
        </View>

        {/* Insurance Number */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Insurance Number</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => pickImage('insurance')} style={styles.cameraButton}>
                <MaterialIcons
                  name="photo-camera"
                  size={24}
                  color={images.insurance ? 'gray' : '#c9c9c9'}
                />
              </TouchableOpacity>
              <MaterialIcons name="description" size={24} color="#FFC107" />
            </View>
          </View>
          <TextInput
            placeholder="Enter Insurance Number"
            style={styles.input}
            value={insuranceNumber}
            onChangeText={(text) => {
              setInsuranceNumber(text);
              handleInputChange();
            }}
          />
          {images.insurance && <Image source={{ uri: images.insurance }} style={styles.imagePreview} />}
        </View>

        {/* ID Proof */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>ID Proof</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => pickImage('idProof')} style={styles.cameraButton}>
                <MaterialIcons
                  name="photo-camera"
                  size={24}
                  color={images.idProof ? 'gray' : '#c9c9c9'}
                />
              </TouchableOpacity>
              <MaterialIcons name="description" size={24} color="#FFC107" />
            </View>
          </View>
          <TextInput
            placeholder="Enter ID Proof Details"
            style={styles.input}
            value={idProof}
            onChangeText={(text) => {
              setIdProof(text);
              handleInputChange();
            }}
          />
          {images.idProof && <Image source={{ uri: images.idProof }} style={styles.imagePreview} />}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: isFormValid ? '#FFC107' : '#ccc' }]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Save Documents</Text>
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
    paddingTop: 50,
    height: 180,
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
    marginLeft: -30,
    marginTop: 80
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  imagePreview: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 10,
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

export default LicenseDocumentsScreen;
