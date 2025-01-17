import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

interface SharedRide {
  id: number;
  from: string;
  fromLat: number;
  fromLng: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  Date: string;
  Time: string;
  Bid: number;
  carType: string;
  numberOfSeats: number;
  AvaliableSeats: number;
}

const SharedRideScreen: React.FC = () => {
  const [sharedRides, setSharedRides] = useState<SharedRide[]>([]);
  const [selectedRide, setSelectedRide] = useState<SharedRide | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedRides = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/shared-rides`);
        setSharedRides(response.data);
      } catch (error) {
        console.error('Error fetching shared rides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedRides();
  }, []);

  const handleJoinRide = () => {
    if (selectedRide) {
      Alert.alert(
        'Join Ride',
        `Are you sure you want to join the ride from ${selectedRide.from} to ${selectedRide.destination}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => confirmJoinRide(selectedRide.id) },
        ]
      );
    }
  };

  const confirmJoinRide = async (rideId: number) => {
    try {
      // Call your API to join the ride
      // Example: await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/join-ride`, { rideId });
      Alert.alert('Success', 'You have successfully joined the ride!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error joining ride:', error);
      Alert.alert('Error', 'Failed to join the ride. Please try again.');
    }
  };

  const renderItem = ({ item }: { item: SharedRide }) => (
    <TouchableOpacity
      style={styles.rideItem}
      onPress={() => {
        setSelectedRide(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.rideInfo}>
        <Text style={styles.rideTitle}>{item.from} to {item.destination}</Text>
        <Text style={styles.rideDetails}>{new Date(item.Date).toLocaleDateString()} at {item.Time}</Text>
        <Text style={styles.rideDetails}>Bid: {item.Bid} Pkr</Text>
      </View>
      <View style={styles.rideSeats}>
        <Text style={styles.seatsText}>{item.AvaliableSeats} seats left</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shared Rides</Text>
        </View>

        <FlatList
          data={sharedRides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />

        <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {selectedRide && (
              <>
                <Text style={styles.modalTitle}>Ride Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>From:</Text>
                  <Text style={styles.detailValue}>{selectedRide.from}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Destination:</Text>
                  <Text style={styles.detailValue}>{selectedRide.destination}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{new Date(selectedRide.Date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{selectedRide.Time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bid:</Text>
                  <Text style={styles.detailValue}>{selectedRide.Bid} Pkr</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Car Type:</Text>
                  <Text style={styles.detailValue}>{selectedRide.carType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Available Seats:</Text>
                  <Text style={styles.detailValue}>{selectedRide.AvaliableSeats}</Text>
                </View>

                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedRide.fromLat,
                    longitude: selectedRide.fromLng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: selectedRide.fromLat, longitude: selectedRide.fromLng }}
                    title="From"
                  />
                  <Marker
                    coordinate={{ latitude: selectedRide.destinationLat, longitude: selectedRide.destinationLng }}
                    title="Destination"
                  />
                  <Polyline
                    coordinates={[
                      { latitude: selectedRide.fromLat, longitude: selectedRide.fromLng },
                      { latitude: selectedRide.destinationLat, longitude: selectedRide.destinationLng },
                    ]}
                    strokeColor="#000"
                    strokeWidth={3}
                  />
                </MapView>

                <TouchableOpacity style={styles.joinButton} onPress={handleJoinRide}>
                  <Text style={styles.joinButtonText}>Join Ride</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  rideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideInfo: {
    flex: 1,
  },
  rideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rideDetails: {
    fontSize: 14,
    color: '#666',
  },
  rideSeats: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seatsText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  map: {
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SharedRideScreen;