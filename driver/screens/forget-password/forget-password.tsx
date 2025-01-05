import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; // For navigation
import axios from "axios";
import { windowHeight } from "@/themes/app.constant";
import color from "@/themes/app.colors";

interface ForgotPasswordScreenProps {}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
  const [contact, setContact] = useState<string>(""); // Email or Phone Number
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // For navigation

  const handleForgotPassword = async () => {
    if (contact.trim() === "") {
      alert("Please enter your email or phone number.");
      return;
    }

    setLoading(true);

    try {
      // Replace this URL with your API endpoint
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/forgot-password`, {
        contact,
      });

      // Handle success response
      alert("Password reset instructions have been sent!");
      router.push("/(routes)/login"); // Navigate back to Login
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email or phone number to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Phone Number"
        placeholderTextColor={color.subtitle}
        value={contact}
        onChangeText={setContact}
        keyboardType="default"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(routes)/login")} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: color.primaryText,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: color.subtitle,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: windowHeight(50),
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    color: color.regularText,
  },
  button: {
    backgroundColor: color.inactive,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: color.inactive,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: color.primaryText,
    textDecorationLine: "underline",
  },
});

export default ForgotPasswordScreen;
