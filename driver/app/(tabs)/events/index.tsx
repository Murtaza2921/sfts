import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter from expo-router
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import color from "@/themes/app.colors";
import { windowHeight } from "@/themes/app.constant";

export default function Events() {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/(routes)/family-event")} // Navigate to FamilyEvents screen
        >
          <MaterialIcons name="family-restroom" size={24} color="#2196F3" />
          <Text style={styles.tabText}>Family Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/(routes)/shared-ride")} // Navigate to SharedRides screen
        >
          <MaterialIcons name="directions-car" size={24} color="#2196F3" />
          <Text style={styles.tabText}>Shared Rides</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <MaterialIcons name="event" size={48} color="#2196F3" />
          <Text style={styles.welcomeText}>
            Welcome to the Events section! Choose between Family Events or Shared Rides to get started.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    fontWeight: "500",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
});