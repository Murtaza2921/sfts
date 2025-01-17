import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EventDetailsModal from "@/components/family-event-popup/family.event.popup";
import { MaterialIcons } from "@expo/vector-icons"; // For icons

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  from: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  bid: number;
};

const mockFamilyEvents: Event[] = [
  {
    id: "1",
    title: "Family Picnic 2025",
    date: "January 20, 2025",
    description: "A fun picnic for the whole family.",
    from: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    destination: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    bid: 50,
  },
  {
    id: "2",
    title: "Reunion Gathering",
    date: "February 10, 2025",
    description: "Catch up with family and friends at this reunion.",
    from: { lat: 40.7128, lng: -74.006 }, // New York
    destination: { lat: 42.3601, lng: -71.0589 }, // Boston
    bid: 75,
  },
];

export default function FamilyEvents() {
  const insets = useSafeAreaInsets();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleAccept = () => {
    console.log("Event accepted:", selectedEvent);
    setIsModalVisible(false);
  };

  const handleDecline = () => {
    console.log("Event declined:", selectedEvent);
    setIsModalVisible(false);
  };

  const handleIncreaseBid = (newBid: number) => {
    if (selectedEvent) {
      console.log("Bid increased for:", selectedEvent.title, "New Bid:", newBid);
      // Update the selected event's bid (for demonstration purposes)
      setSelectedEvent({ ...selectedEvent, bid: newBid });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Events</Text>
      </View>

      {/* Event List */}
      <FlatList
        data={mockFamilyEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)}>
            <View style={styles.eventItem}>
              <View style={styles.eventHeader}>
                <MaterialIcons name="event" size={24} color="#2196F3" />
                <Text style={styles.eventTitle}>{item.title}</Text>
              </View>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <View style={styles.bidContainer}>
                <MaterialIcons name="attach-money" size={18} color="#4CAF50" />
                <Text style={styles.eventBid}>Current Bid: ${item.bid}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        event={selectedEvent}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onIncreaseBid={handleIncreaseBid}
      />
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
  listContent: {
    padding: 16,
  },
  eventItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  bidContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventBid: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
    marginLeft: 4,
  },
});