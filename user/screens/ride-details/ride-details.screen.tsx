import { View, Text, Linking, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import color from "@/themes/app.colors";
import { StyleSheet } from 'react-native';

export default function RideDetailsScreen() {
  const { orderData: orderDataObj } = useLocalSearchParams() as any;
  const orderData = JSON.parse(orderDataObj);
  const [region, setRegion] = useState<any>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (orderData?.driver?.currentLocation && orderData?.driver?.marker) {
      const latitudeDelta =
        Math.abs(
          orderData.driver.marker.latitude -
            orderData.driver.currentLocation.latitude
        ) * 2;
      const longitudeDelta =
        Math.abs(
          orderData.driver.marker.longitude -
            orderData.driver.currentLocation.longitude
        ) * 2;

      setRegion({
        latitude:
          (orderData.driver.marker.latitude +
            orderData.driver.currentLocation.latitude) /
          2,
        longitude:
          (orderData.driver.marker.longitude +
            orderData.driver.currentLocation.longitude) /
          2,
        latitudeDelta: Math.max(latitudeDelta, 0.0922),
        longitudeDelta: Math.max(longitudeDelta, 0.0421),
      });
    }
  }, []);

  const handleEmergency = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        "Emergency SOS",
        "Do you want to send an emergency alert?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Call Emergency",
            onPress: () => {
              // Call emergency number
              Linking.openURL('tel:911');
            },
            style: 'destructive'
          },
          {
            text: "Share Location",
            onPress: () => {
              // Share current location and ride details
              const message = `Emergency! I'm in a ride with:\nDriver: ${orderData?.driver?.name}\nVehicle: ${orderData?.driver?.vehicle_type} (${orderData?.driver?.vehicle_color})\nPhone: ${orderData?.driver?.phone_number}\nCurrent Location: https://www.google.com/maps/search/?api=1&query=${region.latitude},${region.longitude}`;
              Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send emergency alert");
    }
  };

  return (
    <View>
      <View style={{ height: windowHeight(450) }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={(region) => setRegion(region)}
        >
          {orderData?.driver?.marker && (
            <Marker coordinate={orderData?.driver?.marker} />
          )}
          {orderData?.driver?.currentLocation && (
            <Marker coordinate={orderData?.driver?.currentLocation} />
          )}
          {orderData?.driver?.currentLocation && orderData?.driver?.marker && (
            <MapViewDirections
              origin={orderData?.driver?.currentLocation}
              destination={orderData?.driver?.marker}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      </View>
      <View style={{ padding: windowWidth(20) }}>
        <Text
          style={{
            fontSize: fontSizes.FONT20,
            fontWeight: "500",
            paddingVertical: windowHeight(5),
          }}
        >
          Driver Name: {orderData?.driver?.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizes.FONT20,
              fontWeight: "500",
              paddingVertical: windowHeight(5),
            }}
          >
            Phone Number:
          </Text>
          <Text
            style={{
              color: color.buttonBg,
              paddingLeft: 5,
              fontSize: fontSizes.FONT20,
              fontWeight: "500",
              paddingVertical: windowHeight(5),
            }}
            onPress={() =>
              Linking.openURL(`tel:${orderData?.driver?.phone_number}`)
            }
          >
            {orderData?.driver?.phone_number}
          </Text>
        </View>
        <Text style={{ fontSize: fontSizes.FONT20, fontWeight: "500" }}>
          {orderData?.driver?.vehicle_type} Color:{" "}
          {orderData?.driver?.vehicle_color}
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT20,
            fontWeight: "500",
            paddingVertical: windowHeight(5),
          }}
        >
          Payable amount:{" "}
          {(
            orderData.driver?.distance * parseInt(orderData?.driver?.rate)
          ).toFixed(2)}{" "}
          PKR
        </Text>
        <Text
          style={{
            fontSize: fontSizes.FONT14,
            fontWeight: "400",
            paddingVertical: windowHeight(5),
          }}
        >
          **Pay to your driver after reaching to your destination!
        </Text>
        <Pressable
          style={styles.chatButton}
          onPress={() => {
            router.push({
              pathname: "/(routes)/ride-details",
              params: { orderData: JSON.stringify(orderData) },
            });
          }}
        >
          <Text style={styles.chatButtonText}>Chat with your Captain</Text>
        </Pressable>
        
        {/* Emergency SOS Button */}
        <Pressable
          style={styles.sosButton}
          onPress={handleEmergency}
        >
          <Text style={styles.sosButtonText}>EMERGENCY SOS</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: fontSizes.FONT20,
    fontWeight: "500",
    paddingVertical: windowHeight(5),
  },
  linkText: {
    color: color.buttonBg,
    paddingLeft: 5,
    fontSize: fontSizes.FONT20,
    fontWeight: "500",
    paddingVertical: windowHeight(5),
  },
  noteText: {
    fontSize: fontSizes.FONT14,
    fontWeight: "400",
    paddingVertical: windowHeight(5),
  },
  chatButton: {
    backgroundColor: color.buttonBg,
    padding: windowHeight(10),
    borderRadius: 8,
    alignItems: "center",
    marginTop: windowHeight(15),
  },
  chatButtonText: {
    color: "white",
    fontSize: fontSizes.FONT16,
    fontWeight: "600",
  },
  sosButton: {
    backgroundColor: '#FF0000',
    padding: windowHeight(10),
    borderRadius: 8,
    alignItems: "center",
    marginTop: windowHeight(10),
  },
  sosButtonText: {
    color: "white",
    fontSize: fontSizes.FONT16,
    fontWeight: "700",
  },
});