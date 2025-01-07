import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from "react-native";
import { fontSizes, windowHeight, windowWidth } from "@/themes/app.constant";
import { useGetDriverData } from "@/hooks/useGetDriverData";
import { useUpdateDriverData } from "@/hooks/updateDriverData";
import Input from "@/components/common/input";
import SelectInput from "@/components/common/select-input";
import { countryNameItems } from "@/configs/country-name-list";
import Button from "@/components/common/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Toast } from "react-native-toast-notifications";
export default function Profile() {
  const { driver, loading } = useGetDriverData();
  const { updateDriver } = useUpdateDriverData();
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    country: "",
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        phone_number: driver.phone_number || "",
        email: driver.email || "",
        country: driver.country || "",
      });
    }
  }, [driver]);

  const handleUpdate = async () => {
    try {
    await updateDriver(formData);
      const sucess = "Driver updated successfully"
      Toast.show(sucess, {
                placement: "bottom",
                type: "success",
              });
      setIsEditable(false); // Disable editing after successful update
    } catch (error) {
      console.error("Failed to update driver data");
    }
  };

  if (loading || !driver) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Edit Mode</Text>
        <Switch
          value={isEditable}
          onValueChange={(value) => setIsEditable(value)}
        />
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.inputWrapper}>
          <Input
            title="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
            disabled={!isEditable}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            title="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your name"
            disabled={!isEditable}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input
            title="Phone Number"
            value={formData.phone_number}
            onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
            placeholder="Enter your phone number"
            disabled={!isEditable}
          />
        </View>
        <View style={styles.inputWrapper}>
          <SelectInput
            value={formData.country}
            onValueChange={(value) => isEditable && setFormData({ ...formData, country: value })}
            title="Country"
            placeholder="Select your country"
            items={countryNameItems}
           // disabled={!isEditable}
          />
        </View>
        {isEditable && (
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleUpdate}
              title="Update Profile"
              height={windowHeight(40)}
              backgroundColor="green"
              disabled={!isEditable}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            await AsyncStorage.removeItem("accessToken");
            router.push("/(routes)/login");
          }}
          title="Log Out"
          height={windowHeight(40)}
          backgroundColor="crimson"
          
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    padding: windowWidth(15),
  },
  title: {
    textAlign: "center",
    fontSize: fontSizes.FONT30,
    fontWeight: "600",
    marginVertical: windowHeight(20),
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: windowHeight(15),
  },
  toggleText: {
    fontSize: fontSizes.FONT18,
    color: "#333",
  },
  profileContainer: {
    backgroundColor: "#FFF",
    padding: windowWidth(20),
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: windowHeight(15),
  },
  buttonContainer: {
    marginTop: windowHeight(20),
  },
  button: {
    marginBottom: windowHeight(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: fontSizes.FONT20,
    color: "#555",
  },
});
