// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import { useRouter } from "expo-router"; // For navigation
// import axios from "axios";
// import { windowHeight } from "@/themes/app.constant";
// import color from "@/themes/app.colors";

// interface ForgotPasswordScreenProps {}

// const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
//   const [contact, setContact] = useState<string>(""); // Email or Phone Number
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter(); // For navigation

//   const handleForgotPassword = async () => {
//     if (contact.trim() === "") {
//       alert("Please enter your email or phone number.");
//       return;
//     }
  
//     setLoading(true);
  
//     try {
//       // Step 1: Call your forgot password API
//       const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/forget-password`, {
//         contact,
//       });
  
//       // Check if the response is successful
//       if (response.data.success) {
//         alert("Password reset instructions have been sent!");
  
//         // Step 2: Call the send SMS API with the received contact number and a message
//         const smsResponse = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/sendSms`, {
//           recipient: contact,
//           message: `Your password reset verification code is: ${response.data.verificationCode}`,
//         });
  
//         // Step 3: Handle SMS API success
//         if (smsResponse.data.success) {
//           alert("Verification code sent via SMS!");
//           router.push("/(routes)/login"); // Navigate back to Login
//         } else {
//           alert("Failed to send SMS. Please try again.");
//         }
//       } else {
//         alert("Failed to reset password. Please try again.");
//       }
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password?</Text>
//       <Text style={styles.subtitle}>
//         Enter your email or phone number to reset your password.
//       </Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email or Phone Number"
//         placeholderTextColor={color.subtitle}
//         value={contact}
//         onChangeText={setContact}
//         keyboardType="default"
//       />
//       <TouchableOpacity
//         style={[styles.button, loading && styles.buttonDisabled]}
//         onPress={handleForgotPassword}
//         disabled={loading}
//       >
//         {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Submit</Text>}
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push("/(routes)/login")} style={styles.backButton}>
//         <Text style={styles.backButtonText}>Back to Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     backgroundColor: "#FFF",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: color.primaryText,
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: color.subtitle,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     height: windowHeight(50),
//     borderWidth: 1,
//     borderColor: color.border,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     marginBottom: 20,
//     color: color.regularText,
//   },
//   button: {
//     backgroundColor: color.inactive,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: color.inactive,
//   },
//   buttonText: {
//     color: "#ooo",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   backButton: {
//     marginTop: 10,
//   },
//   backButtonText: {
//     color: color.primaryText,
//     textDecorationLine: "underline",
//   },
// });

// export default ForgotPasswordScreen;


import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { windowHeight } from "@/themes/app.constant";
import color from "@/themes/app.colors";

const ForgotPasswordScreen = () => {
  const [contact, setContact] = useState<string>(""); // Email or Phone Number
  const [otp, setOtp] = useState<string>(""); // OTP from the user
  const [newPassword, setNewPassword] = useState<string>(""); // New password
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1 - Contact info, 2 - OTP and New Password
  const [verificationCode, setVerificationCode] = useState<string>(""); // OTP received for password reset
  const router = useRouter(); // For navigation

  // Step 1: Handle the Forgot Password (Request OTP)
  const handleForgotPassword = async () => {
    if (contact.trim() === "") {
      alert("Please enter your email or phone number.");
      return;
    }

    setLoading(true);

    try {
      // Call your forgot password API
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/forget-password`, {
                 contact,
               });

      if (response.data.success) {
        setVerificationCode(response.data.verificationCode); // Store the OTP
        alert("Password reset instructions have been sent!");

        // Step 2: Call the send SMS API with the received contact number and a message
        const smsResponse = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/sendSms`, {
          recipient: contact,
          message: `Your password reset verification code is: ${response.data.verificationCode}`,
        });

        if (smsResponse.data.success) {
          alert("Verification code sent via SMS!");
          setStep(2); // Switch to OTP and New Password input step
        } else {
          alert("Failed to send SMS. Please try again.");
        }
      } else {
        alert("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle the password reset with OTP
  const handleResetPassword = async () => {
    if (otp.trim() === "" || newPassword.trim() === "") {
      alert("Please enter both OTP and new password.");
      return;
    }
    console.log("inside resetpassword")
    setLoading(true);

    try {
      // Call your reset password API
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/driver/resetPassword`, {
        contact,
        otp,
        newPassword,
      });

      if (response.data.success) {
        alert("Password has been reset successfully!");
        router.push("/(routes)/login"); // Navigate to login after successful password reset
      } else {
        alert("Failed to reset password. Please check the OTP.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 ? (
        // Step 1: Forgot Password - Contact Info
        <>
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
        </>
      ) : (
        // Step 2: Reset Password - OTP and New Password
        <>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter OTP and your new password.</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Forgot Password</Text>
          </TouchableOpacity>
        </>
      )}
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
    color: "#ooo",
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