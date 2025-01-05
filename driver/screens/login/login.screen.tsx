import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import AuthContainer from "@/utils/container/auth-container";
import { windowHeight } from "@/themes/app.constant";
import Images from "@/utils/images";
import SignInText from "@/components/login/signin.text";
import { external } from "@/styles/external.style";
import ContactInput from "@/components/login/phone-number.input";
import PasswordInput from "@/components/login/password.input";
import Button from "@/components/common/button";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "./styles"; // Import your existing styles

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [phone_number, setphone_number] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("+92");
  const [password, setPassword] = useState<string>("");
  const toast = useToast();
  const router = useRouter(); // For navigation

  const handleSubmit = async () => {
    if (email.trim() === "" && phone_number.trim() === "") {
      toast.show("Please provide either an email or a phone number!", {
        placement: "bottom",
      });
      return;
    }
    
    if (password.trim() === "") {
      toast.show("Password is required!", {
        placement: "bottom",
      });
      return;
    }

    setloading(true);

    try {
      // Send `contact` and `password` to the server
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/login`, {
        email,
        phone_number,
        password,
      });

      // Handle success response
      const { accessToken } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);

      // Navigate to the next screen (e.g., home or dashboard)
      router.push("/(tabs)/home"); // Adjust this path to your actual route
    } catch (error) {
      console.error("Login Error:", error);

      toast.show("Something went wrong in login", {
        type: "danger",
        placement: "bottom",
      });
    } finally {
      setloading(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to the Sign Up screen (you can adjust the path to your sign-up screen)
    router.push("/(routes)/signup");
  };
  const handleForgotPassword = () => {
    // Navigate to the Forgot Password screen (adjust the path to your actual route)
    
    router.push("/(routes)/forget-password");
  };

  return (
    <AuthContainer
      topSpace={windowHeight(150)}
      imageShow={true}
      container={
        <View>
          <View>
            <Image style={styles.transformLine} source={Images.line} />
            <SignInText />
            <View style={[external.mt_25, external.Pb_10]}>
              <ContactInput
                phone_number={phone_number}
                setphone_number={setphone_number}
                email={email}
                setEmail={setEmail}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
              />
              <PasswordInput
                password={password}
                setPassword={setPassword}
                placeholder="Enter your password"
              />
              <TouchableOpacity
                onPress={() => handleSubmit()}
                disabled={loading}
                style={[
                  signStyle.button,
                  loading && signStyle.buttonDisabled,
                ]}
              >
                <Text style={signStyle.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleForgotPassword} style={styles.signUpText}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
              {/* Sign Up Button */}
              <TouchableOpacity onPress={handleSignUp} style={styles.signUpText}>
                <Text style={styles.signUpText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
};

const signUpStyles = StyleSheet.create({
  signUpButton: {
    marginTop: windowHeight(15),
    alignSelf: "center",
  },
  signUpText: {
    color: "#888", // Adjust color to your design
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

const signStyle = StyleSheet.create({
  button: {
    height: 40, // Increase height
    backgroundColor: "#007AFF", // Button background color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Optional: For rounded corners
    marginBottom: 6
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9", // Disabled button color
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18, // Optional: Adjust font size
    fontWeight: "bold",
  },
});


export default LoginScreen;
