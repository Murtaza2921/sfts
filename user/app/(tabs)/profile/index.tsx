import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { fontSizes, windowWidth } from "@/themes/app.constant";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useGetUserData } from "@/hooks/useGetUserData";

export default function Profile() {
  const { user, loading } = useGetUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    emergency_contact_relationship: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        emergency_contact_name: user.emergency_contact_name || "",
        emergency_contact_number: user.emergency_contact_number || "",
        emergency_contact_relationship: user.emergency_contact_relationship || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load user data.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: 70 }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: fontSizes.FONT30,
          fontWeight: "600",
        }}
      >
        My Profile
      </Text>

      <View style={{ padding: windowWidth(20) }}>
        <Button
          onPress={() => {
            if (isEditing) {
              handleUpdate();
            } else {
              setIsEditing(true);
            }
          }}
          title={isEditing ? "Save" : "Edit"}
          backgroundColor={isEditing ? "#4CAF50" : "#2196F3"}
        />

        {/* Name Input */}
        <Input
          title="Name"
          value={isEditing ? formData.name : user.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter name"
          disabled={!isEditing}
        />

        {/* Email Address */}
        <Input
          title="Email Address"
          value={user.email}
          onChangeText={() => {}}
          placeholder={user.email}
          disabled={true}
        />

        {/* Phone Number */}
        <Input
          title="Phone Number"
          value={user.phone_number}
          onChangeText={() => {}}
          placeholder={user.phone_number}
          disabled={true}
        />

        {/* Emergency Contact Section */}
        <Text
          style={{
            fontSize: fontSizes.FONT20,
            fontWeight: "600",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Emergency Contact
        </Text>
        <Input
          title="Emergency Contact Name"
          value={isEditing ? formData.emergency_contact_name : user.emergency_contact_name}
          onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
          placeholder="Enter emergency contact name"
          disabled={!isEditing}
        />
        <Input
          title="Emergency Contact Number"
          value={isEditing ? formData.emergency_contact_number : user.emergency_contact_number}
          onChangeText={(text) => setFormData({ ...formData, emergency_contact_number: text })}
          placeholder="Enter emergency contact number"
          keyboardType="phone-pad"
          disabled={!isEditing}
        />
        <Input
          title="Relationship"
          value={isEditing ? formData.emergency_contact_relationship : user.emergency_contact_relationship}
          onChangeText={(text) => setFormData({ ...formData, emergency_contact_relationship: text })}
          placeholder="Enter relationship (e.g., Parent, Spouse)"
          disabled={!isEditing}
        />

        {/* Log Out Button */}
        <View style={{ marginVertical: 25 }}>
          <Button
            onPress={async () => {
              await AsyncStorage.removeItem("accessToken");
              router.push("/(routes)/login");
            }}
            title="Log Out"
            backgroundColor="crimson"
          />
        </View>
      </View>
    </View>
  );
}
