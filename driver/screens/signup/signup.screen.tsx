import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import ProgressBar from "@/components/common/progress.bar";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";
import TitleView from "@/components/signup/title.view";
import Input from "@/components/common/input";
import SelectInput from "@/components/common/select-input";
import { countryNameItems } from "@/configs/country-name-list";
import Button from "@/components/common/button";
import color from "@/themes/app.colors";
import { router } from "expo-router";

export default function SignupScreen() {
  const { colors } = useTheme();
  const [emailFormatWarning, setEmailFormatWarning] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    country: "Pakistan 🇵🇰",
    password: ""
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    
    // Reset warnings when user starts typing
    if (key === "phoneNumber" || key === "email" || key === "password") {
      setShowWarning(false);
    }
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    return cleanedNumber.length === 10 && cleanedNumber.startsWith("3");
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phoneNumber || !formData.email || !formData.password) {
      setShowWarning(true);
      Alert.alert("Validation Error", "All fields are required.");
      return; // Stop if fields are empty
    }

    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      Alert.alert("Validation Error", "Contact number must start with '3' and have exactly 10 digits.");
      return;
    }

    // Validate email (example for Gmail)
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid Gmail address.");
      return;
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    // Proceed to next step if all validations pass
    const phoneNumberData = countryNameItems.find(
      (i: any) => i.label === formData.country
    );

    //const phone_number = `+${phoneNumberData?.value}${formData.phoneNumber}`;
    const phone_number = formData.phoneNumber;

    const driverData = {
      name: formData.name,
      country: formData.country,
      phone_number: phone_number,
      email: formData.email,
      password: formData.password
    };

    console.log("here is my driver : ", driverData);
    
    router.push({
      pathname: "/(routes)/document-verification",
      params: driverData,
    });
  };

  return (
    <ScrollView>
      <View>
        {/* logo */}
        <Text
          style={{
            fontFamily: "TT-Octosquares-Medium",
            fontSize: windowHeight(22),
            paddingTop: windowHeight(50),
            textAlign: "center",
          }}
        >
          Sfts Safe Ride
        </Text>
        <View style={{ padding: windowWidth(20) }}>
          <ProgressBar fill={1} />
          <View style={[styles.subView, { backgroundColor: colors.background }]}>
            <View style={styles.space}>
              <TitleView
                title={"Create your account"}
                subTitle={"Explore your life by joining Sfts Safe Ride"}
              />
              <Input
                title="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                showWarning={showWarning && formData.name === ""}
                warning={"Please enter your name!"}
              />
              <SelectInput
                title="Country"
                placeholder="Select your country"
                value={formData.country}
                onValueChange={(text) => handleChange("country", text)}
                showWarning={showWarning && formData.country === ""}
                items={countryNameItems}
              />
              <Input
                title="Phone Number"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
                showWarning={showWarning && formData.phoneNumber === ""}
                warning={"Please enter your phone number!"}
              />
              <Input
                title={"Email Address"}
                placeholder={"Enter your email address"}
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                showWarning={
                  showWarning &&
                  (formData.email === "" || emailFormatWarning !== "")
                }
                warning={
                  emailFormatWarning !== ""
                    ? "Please enter your email!"
                    : "Please enter a valid email!"
                }
              />
               <Input
                title="Password"
                placeholder="Enter your password"
               // secureTextEntry={true} // Ensures text is hidden for security
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                showWarning={showWarning && formData.password === ""}
                warning={"Please enter your password!"}
              />
            </View>
            <View style={styles.margin}>
              <Button
                onPress={handleSubmit} // Use handleSubmit instead of gotoDocument
                height={windowHeight(30)}
                title={"Next"}
                backgroundColor={color.buttonBg}
                textColor={color.whiteColor}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
