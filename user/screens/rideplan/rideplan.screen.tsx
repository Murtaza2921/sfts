import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React from 'react';

import styles from "./styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { external } from "@/styles/external.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { router } from "expo-router";
import { Clock, LeftArrow, PickLocation, PickUpLocation } from "@/utils/icons";
import color from "@/themes/app.colors";
import DownArrow from "@/assets/icons/downArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlaceHolder from "@/assets/icons/placeHolder";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import _ from "lodash";
import axios from "axios";
import * as Location from "expo-location";
import { Toast } from "react-native-toast-notifications";
import moment from "moment";
import { parseDuration } from "@/utils/time/parse.duration";
import Button from "@/components/common/button";
import { useGetUserData } from "@/hooks/useGetUserData";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

export default function RidePlanScreen() {
  const { user } = useGetUserData();
  const ws = useRef<any>(null);
  const notificationListener = useRef<any>();
 
  const [wsConnected, setWsConnected] = useState(false);
  const [places, setPlaces] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<any>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [distance, setDistance] = useState<any>(null);
  
  const [locationSelected, setlocationSelected] = useState(false);
  const [pushTokenRef, setpushTokenRef] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);
  const [selectedVehcile, setselectedVehcile] = useState("Car");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [travelTimes, setTravelTimes] = useState({
    driving: null,
    walking: null,
    bicycling: null,
    transit: null,
  });
  const [keyboardAvoidingHeight, setkeyboardAvoidingHeight] = useState(false);
  const [driverLists, setdriverLists] = useState([]);;
  const [driverLoader, setdriverLoader] = useState(true);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const orderData = {
          currentLocation: notification.request.content.data.currentLocation,
          marker: notification.request.content.data.marker,
          distance: notification.request.content.data.distance,
          driver: notification.request.content.data.orderData,
        };
        router.push({
          pathname: "/(routes)/ride-details",
          params: { orderData: JSON.stringify(orderData) },
        });
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show(
          "Please approve your location tracking otherwise you can't use this app!",
          {
            type: "danger",
            placement: "bottom",
          }
        );
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const initializeWebSocket = () => {
    ws.current = new WebSocket("ws://192.168.116.148:8080");
    ws.current.onopen = () => {
      console.log("Connected to websocket server");
      setWsConnected(true);
    };

    ws.current.onerror = (e: any) => {
      console.log("WebSocket error:", e.message);
    };

    ws.current.onclose = (e: any) => {
      console.log("WebSocket closed:", e.code, e.reason);
      setWsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        initializeWebSocket();
      }, 5000);
    };
  };

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const savePushTokenToDatabase = async (pushToken: string) => {
    console.log("Saving Push notifications")
    const accessToken = await AsyncStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/save-push-token-user`,
        { pushToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Push token saved to the database successfully:", response.data);
    } catch (error) {
      console.error("Failed to save push token to the database:", error);
    }
  };

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log("permissions : ", status)
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Toast.show("Failed to get push token for push notification!", {
          type: "danger",
        });
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        Toast.show("Failed to get project id for push notification!", {
          type: "danger",
        });
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        await savePushTokenToDatabase(pushTokenString);
        console.log(pushTokenString);
        // return pushTokenString;
      } catch (e: unknown) {
        Toast.show(`${e}`, {
          type: "danger",
        });
      }
    } else {
      Toast.show("Must use physical device for Push Notifications", {
        type: "danger",
      });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }

  const fetchPlaces = async (input: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
            language: "en",
          },
        }
      );
      setPlaces(response.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchPlaces = useCallback(_.debounce(fetchPlaces, 100), []);

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchPlaces(query);
    } else {
      setPlaces([]);
    }
  }, [query, debouncedFetchPlaces]);

  const handleInputChange = (text: any) => {
    setQuery(text);
  };

  const fetchTravelTimes = async (origin: any, destination: any) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    let travelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    } as any;

    for (const mode of modes) {
      let params = {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: `${destination.latitude},${destination.longitude}`,
        key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!,
        mode: mode,
      } as any;

      if (mode === "driving") {
        params.departure_time = "now";
      }

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json`,
          { params }
        );

        const elements = response.data.rows[0].elements[0];
        if (elements.status === "OK") {
          travelTimes[mode] = elements.duration.text;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setTravelTimes(travelTimes);
  };

  const handlePlaceSelect = async (placeId: any) => {
    try {
      console.log("place : ", placeId)
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
          },
        }
      );
      console.log("here is the axios error.", response)
      const { lat, lng } = response.data.result.geometry.location;

      const selectedDestination = { latitude: lat, longitude: lng };
      setRegion({
        ...region,
        latitude: lat,
        longitude: lng,
      });
      setMarker({
        latitude: lat,
        longitude: lng,
      });
      setPlaces([]);
      requestNearbyDrivers();
      setlocationSelected(true);
      setkeyboardAvoidingHeight(false);
      if (currentLocation) {
        await fetchTravelTimes(currentLocation, selectedDestination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  };

  const getEstimatedArrivalTime = (travelTime: any) => {
    const now = moment();
    const travelMinutes = parseDuration(travelTime);
    const arrivalTime = now.add(travelMinutes, "minutes");
    return arrivalTime.format("hh:mm A");
  };

  useEffect(() => {
    if (marker && currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        marker.latitude,
        marker.longitude
      );
      setDistance(dist);
    }
  }, [marker, currentLocation]);

  const getNearbyDrivers = () => {
    console.log("step 3");
    ws.current.onmessage = async (e: any) => {
      try {
        const message = JSON.parse(e.data);
        if (message.type === "nearbyDrivers") {
          await getDriversData(message.drivers);
        }
      } catch (error) {
        console.log(error, "Error parsing websocket");
      }
    };
    console.log("step 4");
  };

  const getDriversData = async (drivers: any) => {
    console.log("step 5");
    // Extract driver IDs from the drivers array
    const driverIds = drivers.map((driver: any) => driver.id).join(",");
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/driver/get-drivers-data`,
      {
        params: { ids: driverIds },
      }
    );
    console.log("step 6");
    const driverData = response.data;
    console.log("Driver Data retreive",driverData);
    setdriverLists(driverData);
    setdriverLoader(false);
    console.log("step 7");
  };

  const requestNearbyDrivers = () => {
    console.log("requestNearbyDrivers : ",wsConnected);
    if (currentLocation && wsConnected) {
      ws.current.send(
        JSON.stringify({
          type: "requestRide",
          role: "user",
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );
      console.log("step 2");
      getNearbyDrivers();
    }
  };

  const sendPushNotification = async (expoPushToken: string, data: any) => {
    console.log("Sending push notification...");
  
    // Message structure
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "New Ride Request",
      body: "You have a new ride request.",
      data: { orderData: data },
    };
  
    console.log("Message prepared:", message);
  
    try {
      // Sending push notification via axios
      const response = await axios.post("https://exp.host/--/api/v2/push/send", message);
      console.log("Push notification sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };
  

  const handleOrder = async () => {
    if (!selectedDriverId) return;
  
    setIsBookingConfirmed(true); // Disable button
  
    try {
      console.log("step 8");
  
      const currentLocationName = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation?.latitude},${currentLocation?.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`
      );
  
      const destinationLocationName = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker?.latitude},${marker?.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`
      );
  
      console.log("step 9");
  
      const data = {
        user,
        currentLocation,
        marker,
        distance: distance.toFixed(2),
        currentLocationName: currentLocationName.data.results[0].formatted_address,
        destinationLocation: destinationLocationName.data.results[0].formatted_address,
      };
  
      console.log("step 10 : ", data);
  
      if (pushTokenRef) {
        console.log("step 11");
        await sendPushNotification(pushTokenRef, JSON.stringify(data));
        alert("Booking request sent successfully!");
      } else {
        console.error("Push token is not available");
        alert("Driver push token is missing. Please select another driver.");
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      alert("Failed to complete booking. Please try again.");
      setIsBookingConfirmed(false); // Re-enable button on error
    }
  };

  return (
    <KeyboardAvoidingView
      style={[external.fx_1]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <View
          style={{ height: windowHeight(!keyboardAvoidingHeight ? 500 : 300) }}
        >
          <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={(region) => setRegion(region)}
          >
            {marker && <Marker coordinate={marker} />}
            {currentLocation && <Marker coordinate={currentLocation} />}
            {currentLocation && marker && (
              <MapViewDirections
                origin={currentLocation}
                destination={marker}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
                strokeWidth={4}
                strokeColor="blue"
              />
            )}
          </MapView>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={[styles.container]}>
          {locationSelected ? (
            <>
              {driverLoader ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 400,
                  }}
                >
                  <ActivityIndicator size={"large"} />
                </View>
              ) : (
                <ScrollView
                  style={{
                    paddingBottom: windowHeight(20),
                    height: windowHeight(280),
                  }}
                >
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#b5b5b5",
                      paddingBottom: windowHeight(10),
                      flexDirection: "row",
                    }}
                  >
                    <Pressable onPress={() => setlocationSelected(false)}>
                      <LeftArrow />
                    </Pressable>
                    <Text
                      style={{
                        margin: "auto",
                        fontSize: 20,
                        fontWeight: "600",
                      }}
                    >
                      Gathering options
                    </Text>
                  </View>
                  <View style={{ padding: windowWidth(10) }}>
                 
                  {driverLists?.map((driver: DriverType) => (
  <Pressable
    key={String(driver.id)}
    style={{
      width: windowWidth(420),
      borderWidth: selectedDriverId === String(driver.id) ? 2 : 1,  // Thin border for all items
      borderColor: "#ccc",  // Light grey color for border
      borderRadius: 10,
      padding: 10,
      marginVertical: 8,  // Slightly increased spacing for better separation
      backgroundColor: selectedDriverId === String(driver.id) ? "#e0f7fa" : "white",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,  // Elevation for Android shadow effect
    }}
    onPress={() => {
      setSelectedDriverId(String(driver.id));
      setpushTokenRef(driver.notificationToken);
    }}
  >
    <View style={{ alignItems: "center" }}>
      <Image
        source={
          driver?.vehicle_type === "Car"
            ? require("@/assets/images/vehicles/car.png")
            : driver?.vehicle_type === "Motorcycle"
            ? require("@/assets/images/vehicles/bike.png")
            : require("@/assets/images/vehicles/bike.png")
        }
        style={{ width: 90, height: 80 }}
      />
    </View>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 5,
      }}
    >
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          SFTS {driver?.vehicle_type}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {getEstimatedArrivalTime(travelTimes.driving)} dropoff
        </Text>
      </View>
      <Text style={{ fontSize: windowWidth(20), fontWeight: "600" }}>
        PKR {(distance.toFixed(2) * parseInt(driver.rate)).toFixed(2)}
      </Text>
    </View>
  </Pressable>
))}


<View
  style={{
    paddingHorizontal: windowWidth(10),
    marginTop: windowHeight(15),
  }}
>
  <Button
    backgroundColor={selectedDriverId && !isBookingConfirmed ? "#000" : "#d3d3d3"} // Change button color
    textColor={selectedDriverId && !isBookingConfirmed ? "#fff" : "#808080"}
    title={isBookingConfirmed ? "Request Sent" : "Confirm Booking"}
    onPress={handleOrder}
    disabled={!selectedDriverId || isBookingConfirmed} // Disable button if no driver selected or booking confirmed
  />
</View>
                  </View>
                </ScrollView>
              )}  
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()}>
                  <LeftArrow />
                </TouchableOpacity>
                <Text
                  style={{
                    margin: "auto",
                    fontSize: windowWidth(25),
                    fontWeight: "600",
                  }}
                >
                  Plan your ride
                </Text>
              </View>
              {/* picking up time */}
              <View
                style={{
                  width: windowWidth(200),
                  height: windowHeight(28),
                  borderRadius: 20,
                  backgroundColor: color.lightGray,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: windowHeight(10),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock />
                  <Text
                    style={{
                      fontSize: windowHeight(12),
                      fontWeight: "600",
                      paddingHorizontal: 8,
                    }}
                  >
                    Pick-up now
                  </Text>
                  <DownArrow />
                </View>
              </View>
              {/* picking up location */}
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#000",
                  borderRadius: 15,
                  marginBottom: windowHeight(15),
                  paddingHorizontal: windowWidth(15),
                  paddingVertical: windowHeight(5),
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <PickLocation />
                  <View
                    style={{
                      width: Dimensions.get("window").width * 1 - 110,
                      borderBottomWidth: 1,
                      borderBottomColor: "#999",
                      marginLeft: 5,
                      height: windowHeight(20),
                    }}
                  >
                    <Text
                      style={{
                        color: "#2371F0",
                        fontSize: 18,
                        paddingLeft: 5,
                      }}
                    >
                      Current Location
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 12,
                  }}
                >
                  <PlaceHolder />
                  <View
                    style={{
                      marginLeft: 5,
                      width: Dimensions.get("window").width * 1 - 110,
                    }}
                  >
                    <GooglePlacesAutocomplete
                      placeholder="Where to?"
                      onPress={(data, details = null) => {
                        setkeyboardAvoidingHeight(true);
                        setPlaces([
                          {
                            description: data.description,
                            place_id: data.place_id,
                          },
                        ]);
                      }}
                      query={{
                        key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
                        language: "en",
                      }}
                      styles={{
                        textInputContainer: {
                          width: "100%",
                        },
                        textInput: {
                          height: 38,
                          color: "#000",
                          fontSize: 16,
                        },
                        predefinedPlacesDescription: {
                          color: "#000",
                        },
                      }}
                      textInputProps={{
                        onChangeText: (text) => handleInputChange(text),
                        value: query,
                        onFocus: () => setkeyboardAvoidingHeight(true),
                      }}
                      onFail={(error) => console.log(error)}
                      fetchDetails={true}
                      debounce={200}
                    />
                  </View>
                </View>
              </View>
              {/* Last sessions */}
              {places.map((place: any, index: number) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: windowHeight(20),
                  }}
                  onPress={() => handlePlaceSelect(place.place_id)}
                >
                  <PickUpLocation />
                  <Text style={{ paddingLeft: 15, fontSize: 18 }}>
                    {place.description}
                  </Text>
                </Pressable>
              ))}
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
