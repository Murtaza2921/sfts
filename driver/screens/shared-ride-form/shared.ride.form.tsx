import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker"; // Import Picker
import Toast from "react-native-toast-message";

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

// Define the VehicleType enum
enum VehicleType {
  Car = "Car",
  bolan = "bolan",
  van = "van",
}

export default function SharedRideForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bid, setBid] = useState("");
  const [carType, setCarType] = useState<VehicleType>(VehicleType.Car); // Use enum for carType
  const [seats, setSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [fromQuery, setFromQuery] = useState<string>('');
  const [destinationQuery, setDestinationQuery] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    if (id) {
      // Fetch the existing shared ride data from the API
      const fetchRide = async () => {
        try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/get-all`);
          const rides = await response.json();
          const ride = rides.find((r: any) => r.id.toString() === id);

          if (ride) {
            setFrom(ride.from);
            setDestination(ride.destination);
            setDate(ride.Date);
            setTime(ride.Time);
            setBid(ride.Bid.toString());
            setCarType(ride.carType as VehicleType); // Cast to VehicleType
            setSeats(ride.numberOfSeats.toString());
            setAvailableSeats(ride.AvaliableSeats.toString());
          }
        } catch (error) {
          console.error("Error fetching shared ride:", error);
        }
      };

      fetchRide();
    }
  }, [id]);

  const handleSave = async () => {
    const newRide = {
      from,
      fromLat: fromCoords?.lat || 0,
      fromLng: fromCoords?.lng || 0,
      destination,
      destinationLat: destinationCoords?.lat || 0,
      destinationLng: destinationCoords?.lng || 0,
      date,
      time,
      bid,
      carType,
      numberOfSeats: seats,
      availableSeats,
    };

    try {
      const url = id
        ? `${process.env.EXPO_PUBLIC_SERVER_URI}/driver/update/${id}`
        : `${process.env.EXPO_PUBLIC_SERVER_URI}/driver/create`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRide),
      });

      if (response.ok) {
       
        Toast.show({
          type: "success",
          text1: id ? "Shared Ride Updated" : "Shared Ride Added",
          text2: id ? "Your shared ride has been updated successfully." : "Your shared ride has been added successfully.",
        });
        router.back();
      } else {
        console.error("Failed to save shared ride");
      }
    } catch (error) {
      console.error("Error saving shared ride:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setDate(dateString);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      setTime(timeString);
    }
  };

  const renderGooglePlacesInput = (
    placeholder: string,
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setLocation: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
  ) => (
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
        key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
        language: 'en',
      }}
      fetchDetails
      styles={{
        container: { flex: 0, marginBottom: 10 },
        textInput: {
          height: 40,
          color: '#000',
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
        },
      }}
      textInputProps={{
        onChangeText: (text) => setQuery(text),
        value: query,
      }}
      debounce={200}
    />
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
      component: renderGooglePlacesInput('Where from?', fromQuery, setFromQuery, setFrom, setFromCoords),
    },
    {
      key: "destination",
      component: renderGooglePlacesInput('Where to?', destinationQuery, setDestinationQuery, setDestination, setDestinationCoords),
    },
    {
      key: "date",
      component: (
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            label="Date"
            value={date}
            editable={false}
            style={styles.input}
          />
        </TouchableOpacity>
      ),
    },
    {
      key: "time",
      component: (
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <TextInput
            label="Time"
            value={time}
            editable={false}
            style={styles.input}
          />
        </TouchableOpacity>
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={carType}
            onValueChange={(itemValue) => setCarType(itemValue as VehicleType)}
            style={styles.picker}
          >
            {Object.values(VehicleType).map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
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
          keyboardType="numeric"
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
          keyboardType="numeric"
        />
      ),
    },
    {
      key: "buttons",
      component: (
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            {id ? "Update" : "Save"}
          </Button>
          <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
            Cancel
          </Button>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={formFields}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => item.component}
          contentContainerStyle={styles.flatListContent}
          keyboardShouldPersistTaps="always" // Fix for keyboard issue
        />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  pickerContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 10,
  },
});