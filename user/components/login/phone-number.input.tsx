import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight } from "@/themes/app.constant";
import color from "@/themes/app.colors";

interface Props {
  width?: number;
  phone_number: string;
  setphone_number: (phone_number: string) => void;
  email: string;
  setEmail: (email: string) => void;
  countryCode: string;
  setCountryCode: (countryCode: string) => void;
}

export default function ContactInput({
  width,
  phone_number,
  setphone_number,
  email,
  setEmail,
  countryCode,
  setCountryCode,
}: Props) {
  const [isPhone, setIsPhone] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.mediumTextBlack, styles.label]}>
        {isPhone ? "Phone Number" : "Email Address"}
      </Text>
      {isPhone ? (
        <View style={styles.inputRow}>
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>+92</Text>
          </View>
          <TextInput
            style={[commonStyles.regularText, styles.input]}
            placeholder={"Enter your phone number"}
            placeholderTextColor={color.subtitle}
            keyboardType="numeric"
            value={phone_number}
            onChangeText={setphone_number}
            maxLength={10}
          />
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={[commonStyles.regularText, styles.input]}
            placeholder={"Enter your email"}
            placeholderTextColor={color.subtitle}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      )}
      <TouchableOpacity onPress={() => setIsPhone(!isPhone)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isPhone ? "Use Email Instead" : "Use Phone Number Instead"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: windowHeight(8),
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    height: windowHeight(50),
    //backgroundColor: color.lightBackground,
  },
  prefixContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: color.border,
  },
  prefixText: {
    fontSize: 16,
    color: color.regularText,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: color.regularText,
  },
  toggleButton: {
    marginTop: windowHeight(10),
    alignSelf: "center",
  },
  toggleText: {
    color: color.primaryText,
    textDecorationLine: "underline",
  },
});
