// // app/(routes)/shared-ride.tsx
// import React, { useState } from "react";
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
// import { Button } from "react-native-paper";
// import SharedRideFormModal from "@/components/sharedRide/sharedRideFormModel"; // Import the SharedRideFormModal component
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// type SharedRide = {
//   id: string;
//   from: string;
//   destination: string;
//   date: string;
//   time: string;
//   bid: string;
//   carType: string;
//   seats: string;
//   availableSeats: string;
// };

// const SharedRides: React.FC = () => {
//   const insets = useSafeAreaInsets();
//   const [sharedRides, setSharedRides] = useState<SharedRide[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRide, setSelectedRide] = useState<SharedRide | undefined>(undefined); // Change null to undefined

//   const handleAddOrEditRide = (ride: SharedRide) => {
//     if (selectedRide) {
//       // Edit existing ride
//       setSharedRides(sharedRides.map((r) => (r.id === ride.id ? ride : r)));
//     } else {
//       // Add new ride
//       setSharedRides([...sharedRides, ride]);
//     }
//     setSelectedRide(undefined); // Change null to undefined
//   };

//   const handleDelete = (id: string) => {
//     setSharedRides(sharedRides.filter((ride) => ride.id !== id));
//   };

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       <Button mode="contained" onPress={() => setIsModalVisible(true)} style={styles.addButton}>
//         Add New Shared Ride
//       </Button>

//       <FlatList
//         data={sharedRides}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.rideItem}>
//             <Text>From: {item.from}</Text>
//             <Text>Destination: {item.destination}</Text>
//             <Text>Date: {item.date}</Text>
//             <Text>Time: {item.time}</Text>
//             <Text>Bid: {item.bid}</Text>
//             <Text>Car Type: {item.carType}</Text>
//             <Text>Seats: {item.seats}</Text>
//             <Text>Available Seats: {item.availableSeats}</Text>
//             <TouchableOpacity
//               style={styles.editButton}
//               onPress={() => {
//                 setSelectedRide(item);
//                 setIsModalVisible(true);
//               }}
//             >
//               <Text style={styles.buttonText}>Edit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
//               <Text style={styles.buttonText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       <SharedRideFormModal
//         visible={isModalVisible}
//         onDismiss={() => {
//           setIsModalVisible(false);
//           setSelectedRide(undefined); // Change null to undefined
//         }}
//         onSubmit={handleAddOrEditRide}
//         initialData={selectedRide}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 16,
//       paddingTop: 50, // Add padding to avoid overlap with the top bar
//     },
//     addButton: {
//       marginBottom: 16,
//     },
//     rideItem: {
//       padding: 16,
//       borderBottomWidth: 1,
//       borderBottomColor: "#ccc",
//     },
//     editButton: {
//       backgroundColor: "#4CAF50",
//       padding: 8,
//       borderRadius: 4,
//       marginTop: 8,
//     },
//     deleteButton: {
//       backgroundColor: "#F44336",
//       padding: 8,
//       borderRadius: 4,
//       marginTop: 8,
//     },
//     buttonText: {
//       color: "#fff",
//       textAlign: "center",
//     },
//   });
// export default SharedRides;



// app/(routes)/shared-ride.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

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

  // Initialize with dummy rides
  const [sharedRides, setSharedRides] = useState<SharedRide[]>([
    {
      id: "1",
      from: "New York",
      destination: "Boston",
      date: "2023-10-15",
      time: "10:00 AM",
      bid: "$20",
      carType: "Sedan",
      seats: "4",
      availableSeats: "2",
    },
    {
      id: "2",
      from: "Los Angeles",
      destination: "San Francisco",
      date: "2023-11-01",
      time: "09:00 AM",
      bid: "$30",
      carType: "SUV",
      seats: "6",
      availableSeats: "4",
    },
    {
      id: "3",
      from: "Chicago",
      destination: "Detroit",
      date: "2023-12-05",
      time: "08:00 AM",
      bid: "$25",
      carType: "Minivan",
      seats: "8",
      availableSeats: "5",
    },
  ]);

  const handleAddOrEditRide = (ride: SharedRide) => {
    if (ride.id) {
      // Edit existing ride
      setSharedRides(sharedRides.map((r) => (r.id === ride.id ? ride : r)));
    } else {
      // Add new ride
      setSharedRides([...sharedRides, { ...ride, id: String(Math.random()) }]);
    }
  };

  const handleDelete = (id: string) => {
    setSharedRides(sharedRides.filter((ride) => ride.id !== id));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Add New Shared Ride Button */}
      <Button
        mode="contained"
        onPress={() => router.push("/(routes)/shared-ride-form")}
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
                  router.push(`/(routes)/shared-ride-form?id=${item.id}`)
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#6200ee",
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