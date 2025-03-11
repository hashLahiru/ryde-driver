import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen({ navigation }) {
  const [pickup, setPickup] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const [drop, setDrop] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  const handleFindDriver = () => {
    if (!pickupLocation || !dropLocation || !drop) {
      Alert.alert(
        "Error",
        "Please provide valid pickup and drop locations on the map!"
      );
      return;
    }
    Alert.alert(
      "Locations Submitted",
      `Pickup: ${pickupLocation}\nDrop: ${dropLocation}`
    );
    // Add navigation logic or further processing here.
  };

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => setDrop(e.nativeEvent.coordinate)}
        >
          <Marker
            coordinate={pickup}
            draggable
            onDragEnd={(e) => setPickup(e.nativeEvent.coordinate)}
            title="Pickup"
          />
          {drop && (
            <Marker
              coordinate={drop}
              title="Drop"
              pinColor="blue"
            />
          )}
        </MapView>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          value={pickupLocation}
          onChangeText={setPickupLocation}
          placeholder="Enter Pickup Location"
        />

        <Text style={styles.label}>Drop Location</Text>
        <TextInput
          style={styles.input}
          value={dropLocation}
          onChangeText={setDropLocation}
          placeholder="Enter Drop Location"
        />

        <TouchableOpacity style={styles.button} onPress={handleFindDriver}>
          <Text style={styles.buttonText}>Find a Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  mapContainer: {
    flex: 2,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom:80
    
   
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#ff9600",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#ff9600",
    fontSize: 14,
    fontWeight: "bold",
  },
});
