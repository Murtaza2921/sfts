import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons'; // For icons

export default function Services() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Services</Text>

      {/* Family Event Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          router.push("/(routes)/family-event");
        }}
      >
        <MaterialIcons name="family-restroom" size={24} color="#fff" />
        <Text style={styles.buttonText}>Family Event</Text>
      </TouchableOpacity>

      {/* Shared Rides Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          router.push("/(routes)/shared-rides");
        }}
      >
        <MaterialIcons name="directions-car" size={24} color="#fff" />
        <Text style={styles.buttonText}>Shared Rides</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // Light background
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333', // Dark text
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee', // Purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Space between icon and text
  },
});