import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import axios from "axios";

type SharedRide = {
  id: string;
  from: string;
  destination: string;
  date: string;
  time: string;
  bid: string;
  carType: string;
  seats: string;
  availableSeats: string;
};

const SharedRides: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sharedRides, setSharedRides] = useState<SharedRide[]>([]);

  // Fetch shared rides from the API
  const fetchSharedRides = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/get-all`);
      const formattedRides = response.data.map((ride: any) => ({
        id: ride.id.toString(),
        from: ride.from,
        destination: ride.destination,
        date: ride.Date.split("T")[0], // Format date as YYYY-MM-DD
        time: ride.Time,
        bid: `${ride.Bid}`,
        carType: ride.carType,
        seats: ride.numberOfSeats.toString(),
        availableSeats: ride.AvaliableSeats.toString(),
      }));
      setSharedRides(formattedRides);
    } catch (error) {
      console.error("Error fetching shared rides:", error);
    }
  };

  useEffect(() => {
    fetchSharedRides();
  }, []);

  // Callback function to update the shared ride list
  const handleSave = (newRide: SharedRide) => {
    if (newRide.id) {
      // Update existing ride
      setSharedRides((prevRides) =>
        prevRides.map((r) => (r.id === newRide.id ? newRide : r))
      );
    } else {
      // Add new ride
      setSharedRides((prevRides) => [...prevRides, { ...newRide, id: String(Math.random()) }]);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/delete/${id}`);
      if (response.status === 200) {
        // Remove the ride from the local state
        setSharedRides((prevRides) => prevRides.filter((ride) => ride.id !== id));
        Toast.show({
          type: "success",
          text1: "Shared Ride Deleted",
          text2: "Your shared ride has been deleted successfully.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to delete shared ride. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting shared ride:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An error occurred while deleting the shared ride.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={["top"]}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Add New Shared Ride Button */}
        <Button
          mode="contained"
          onPress={() =>
            router.push({
              pathname: "/(routes)/shared-ride-form",
              params: { onSave: JSON.stringify(handleSave) },
            })
          }
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
        >
          Add New Shared Ride
        </Button>

        {/* List of Shared Rides */}
        <FlatList
          data={sharedRides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.rideItem}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideTitle}>{item.from} to {item.destination}</Text>
                <Text style={styles.rideSubtitle}>{item.date} at {item.time}</Text>
              </View>
              <View style={styles.rideDetails}>
                <Text style={styles.detailText}>Bid: {item.bid}</Text>
                <Text style={styles.detailText}>Car Type: {item.carType}</Text>
                <Text style={styles.detailText}>Seats: {item.seats}</Text>
                <Text style={styles.detailText}>Available Seats: {item.availableSeats}</Text>
              </View>
              <View style={styles.rideActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    router.push({
                      pathname: "/(routes)/shared-ride-form",
                      params: { id: item.id, onSave: JSON.stringify(handleSave) },
                    })
                  }
                >
                  <MaterialIcons name="edit" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 10,
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  rideItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    marginBottom: 8,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  rideSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  rideDetails: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  rideActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});

export default SharedRides;