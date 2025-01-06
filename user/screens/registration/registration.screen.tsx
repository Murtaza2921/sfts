import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import TitleView from "@/components/signup/title.view";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import color from "@/themes/app.colors";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";

export default function RegistrationScreen() {
  const toast = useToast();
  const { colors } = useTheme();
  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",  // You can fetch this from a previous screen or capture as input.
    email: "",
    password: "", // Add password field here
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      setShowWarning(true);
      return; // Stop if fields are empty
    }
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/register`, {
        name: formData.name,
        phone_number: formData.phoneNumber,
        email: formData.email,
        password: formData.password, // Send password as well
      });

      setLoading(false);
      const { token } = response.data;

      // Store the token in AsyncStorage
      await AsyncStorage.setItem("accessToken", token);

      // Navigate to the home screen after successful registration
      router.push("/(tabs)/home");
    } catch (error) {
      setLoading(false);
      console.log("Registration error", error);
      toast.show("Registration failed. Please try again.", {
        type: "danger",
        placement: "bottom",
      });
    }
  };

  return (
    <ScrollView>
      <View>
        {/* Logo */}
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowHeight(25),
            paddingTop: windowHeight(50),
            textAlign: "center",
          }}
        >
          Sfts Safe Ride
        </Text>
        <View style={{ padding: windowWidth(20) }}>
          <View style={[styles.subView, { backgroundColor: colors.background }]}>
            <View style={styles.space}>
              <TitleView
                title={"Create your account"}
                subTitle="Explore your life by joining Sfts Safe Ride"
              />
              <Input
                title="Name"
                placeholder="Enter your name"
                value={formData?.name}
                onChangeText={(text) => handleChange("name", text)}
                showWarning={showWarning && formData.name === ""}
                warning={"Please enter your name!"}
              />
              <Input
                title="Phone Number"
                placeholder="Enter your phone number"
                value={formData?.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
                showWarning={showWarning && formData.phoneNumber === ""}
                warning={"Please enter your phone number!"}
              />
              <Input
                title="Email Address"
                placeholder="Enter your email address"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                showWarning={showWarning && formData.email === ""}
                warning={"Please enter your email address!"}
              />
              <Input
                title="Password"
                placeholder="Enter your password"
               
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                showWarning={showWarning && formData.password === ""}
                warning={"Please enter your password!"}
              />
              <View style={styles.margin}>
                <Button
                  onPress={() => handleSubmit()}
                  title="Sign Up"
                  disabled={loading}
                  backgroundColor={color.buttonBg}
                  textColor={color.whiteColor}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  subView: {
    height: "100%",
  },
  space: {
    marginHorizontal: windowWidth(4),
  },
  margin: {
    marginVertical: windowHeight(12),
  },
});
