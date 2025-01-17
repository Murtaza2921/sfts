import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

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

export default function SharedRideForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bid, setBid] = useState("");
  const [carType, setCarType] = useState("");
  const [seats, setSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (id) {
      const existingRide = {
        id: "1",
        from: "New York",
        destination: "Boston",
        date: "2023-10-15",
        time: "10:00 AM",
        bid: "$20",
        carType: "Sedan",
        seats: "4",
        availableSeats: "2",
      };
      setFrom(existingRide.from);
      setDestination(existingRide.destination);
      setDate(existingRide.date);
      setTime(existingRide.time);
      setBid(existingRide.bid);
      setCarType(existingRide.carType);
      setSeats(existingRide.seats);
      setAvailableSeats(existingRide.availableSeats);
    }
  }, [id]);

  const handleSave = () => {
    const newRide: SharedRide = {
      id: id || String(Math.random()),
      from,
      destination,
      date,
      time,
      bid,
      carType,
      seats,
      availableSeats,
    };
    console.log("Saved ride:", newRide);
    router.back();
  };

  const renderGooglePlacesInput = (
    placeholder: string,
    location: string,
    setLocation: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
  ) => (
    <View style={styles.inputContainer}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        onPress={(data, details = null) => {
          setLocation(data.description);
          if (details && details.geometry) {
            setCoords({
              lat: details.geometry.location.lat,
              lng: details.geometry.location.lng,
            });
          }
        }}
        query={{
          key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`,
          language: "en",
        }}
        fetchDetails
        styles={{
          container: { flex: 1 },
          textInput: styles.input,
          listView: styles.listView,
          row: { padding: 10 },
        }}
        textInputProps={{
          value: location,
          onChangeText: setLocation,
        }}
        enablePoweredByContainer={false} // Optional: Hide "Powered by Google"
      />
    </View>
  );

  const formFields = [
    {
      key: "title",
      component: (
        <Title style={styles.title}>
          {id ? "Edit Shared Ride" : "Add New Shared Ride"}
        </Title>
      ),
    },
    {
      key: "from",
      component: renderGooglePlacesInput("Where from?", from, setFrom, setFromCoords),
    },
    {
      key: "destination",
      component: renderGooglePlacesInput("Where to?", destination, setDestination, setDestinationCoords),
    },
    {
      key: "date",
      component: (
        <TextInput
          label="Date"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />
      ),
    },
    {
      key: "time",
      component: (
        <TextInput
          label="Time"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />
      ),
    },
    {
      key: "bid",
      component: (
        <TextInput
          label="Bid"
          value={bid}
          onChangeText={setBid}
          style={styles.input}
        />
      ),
    },
    {
      key: "carType",
      component: (
        <TextInput
          label="Car Type"
          value={carType}
          onChangeText={setCarType}
          style={styles.input}
        />
      ),
    },
    {
      key: "seats",
      component: (
        <TextInput
          label="Total Seats"
          value={seats}
          onChangeText={setSeats}
          style={styles.input}
        />
      ),
    },
    {
      key: "availableSeats",
      component: (
        <TextInput
          label="Available Seats"
          value={availableSeats}
          onChangeText={setAvailableSeats}
          style={styles.input}
        />
      ),
    },
    {
      key: "buttons",
      component: (
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
          <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
            Cancel
          </Button>
        </View>
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    flatListContent: {
      flexGrow: 1,
    },
    title: {
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      marginBottom: 16,
      backgroundColor: "#fff",
    },
    inputContainer: {
      marginBottom: 16,
      zIndex: 9999, // Ensure this has a high zIndex value
      elevation: 5, // Ensure it's raised on Android
    },
    buttonContainer: {
      marginTop: 20,
    },
    button: {
      marginTop: 10,
    },
    listView: {
      backgroundColor: "#fff",
      borderRadius: 5,
      position: "absolute",
      top: 50,
      maxHeight: 200,
      zIndex: 9999, // Ensure the suggestion list has a higher zIndex
      elevation: 10, // Ensure the suggestion list is above other content on Android
    },
  });
  