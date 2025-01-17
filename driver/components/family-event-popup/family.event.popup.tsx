import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Button } from "react-native-paper";

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  from: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  bid: number;
};

type EventDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  event: Event | null;
  onAccept: () => void;
  onDecline: () => void;
  onIncreaseBid: (newBid: number) => void;
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  visible,
  onClose,
  event,
  onAccept,
  onDecline,
  onIncreaseBid,
}) => {
  const [newBid, setNewBid] = useState("");

  if (!event) return null;

  // Calculate the map region to show both from and destination locations
  const calculateMapRegion = () => {
    const { from, destination } = event;

    // Calculate the center of the map
    const centerLat = (from.lat + destination.lat) / 2;
    const centerLng = (from.lng + destination.lng) / 2;

    // Calculate the latitude and longitude deltas with a buffer
    const latDelta = Math.abs(from.lat - destination.lat) * 1.5;
    const lngDelta = Math.abs(from.lng - destination.lng) * 1.5;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  const mapRegion = calculateMapRegion();

  const handleIncreaseBid = () => {
    const bidAmount = parseFloat(newBid);
    if (!isNaN(bidAmount) && bidAmount > 0) {
      onIncreaseBid(bidAmount);
      setNewBid("");
    } else {
      alert("Please enter a valid bid amount.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{event.title}</Text>
          <Text style={styles.modalDate}>{event.date}</Text>
          <Text style={styles.modalDescription}>{event.description}</Text>

          {/* Current Bid */}
          <Text style={styles.currentBid}>Current Bid: ${event.bid}</Text>

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={mapRegion}>
              {/* Markers for From and Destination */}
              <Marker
                coordinate={{ latitude: event.from.lat, longitude: event.from.lng }}
                title="From"
              />
              <Marker
                coordinate={{ latitude: event.destination.lat, longitude: event.destination.lng }}
                title="Destination"
              />

              {/* Polyline for Path Track */}
              <Polyline
                coordinates={[
                  { latitude: event.from.lat, longitude: event.from.lng },
                  { latitude: event.destination.lat, longitude: event.destination.lng },
                ]}
                strokeColor="#2196F3"
                strokeWidth={3}
              />
            </MapView>
          </View>

          {/* Bid Increase Field */}
          <View style={styles.bidContainer}>
            <TextInput
              placeholder="Enter new bid amount"
              value={newBid}
              onChangeText={setNewBid}
              keyboardType="numeric"
              style={styles.bidInput}
            />
            <Button mode="contained" onPress={handleIncreaseBid} style={styles.bidButton}>
              Increase Bid
            </Button>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={onAccept} style={styles.button}>
              Accept
            </Button>
            <Button mode="outlined" onPress={onDecline} style={styles.button}>
              Decline
            </Button>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  currentBid: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  bidContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  bidButton: {
    width: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#2196F3",
    fontSize: 16,
  },
});

export default EventDetailsModal;