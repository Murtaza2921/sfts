import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Modal, TextInput, Title } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

type SharedRideFormModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (ride: SharedRide) => void;
  initialData?: SharedRide | null;
};

const SharedRideFormModal: React.FC<SharedRideFormModalProps> = ({
  visible,
  onDismiss,
  onSubmit,
  initialData,
}) => {
  const insets = useSafeAreaInsets();
  const [from, setFrom] = useState(initialData?.from || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [bid, setBid] = useState(initialData?.bid || "");
  const [carType, setCarType] = useState(initialData?.carType || "");
  const [seats, setSeats] = useState(initialData?.seats || "");
  const [availableSeats, setAvailableSeats] = useState(
    initialData?.availableSeats || ""
  );

  useEffect(() => {
    if (initialData) {
      setFrom(initialData.from);
      setDestination(initialData.destination);
      setDate(initialData.date);
      setTime(initialData.time);
      setBid(initialData.bid);
      setCarType(initialData.carType);
      setSeats(initialData.seats);
      setAvailableSeats(initialData.availableSeats);
    } else {
      setFrom("");
      setDestination("");
      setDate("");
      setTime("");
      setBid("");
      setCarType("");
      setSeats("");
      setAvailableSeats("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    const newRide: SharedRide = {
      id: initialData?.id || String(Math.random()),
      from,
      destination,
      date,
      time,
      bid,
      carType,
      seats,
      availableSeats,
    };
    onSubmit(newRide);
    onDismiss();
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[styles.modalContent, { paddingTop: insets.top }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Title>{initialData ? "Edit Shared Ride" : "Add New Shared Ride"}</Title>
            <TextInput
              label="From"
              value={from}
              onChangeText={setFrom}
              style={styles.input}
            />
            <TextInput
              label="Destination"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
            />
            <TextInput
              label="Date"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              label="Time"
              value={time}
              onChangeText={setTime}
              style={styles.input}
            />
            <TextInput
              label="Bid"
              value={bid}
              onChangeText={setBid}
              style={styles.input}
            />
            <TextInput
              label="Car Type"
              value={carType}
              onChangeText={setCarType}
              style={styles.input}
            />
            <TextInput
              label="Total Seats"
              value={seats}
              onChangeText={setSeats}
              style={styles.input}
            />
            <TextInput
              label="Available Seats"
              value={availableSeats}
              onChangeText={setAvailableSeats}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Save
            </Button>
            <Button mode="outlined" onPress={onDismiss} style={styles.button}>
              Cancel
            </Button>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 20,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default SharedRideFormModal;
