import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight } from "@/themes/app.constant";
import color from "@/themes/app.colors";

interface Props {
  password: string;
  setPassword: (password: string) => void;
  placeholder?: string;
}

export default function PasswordInput({
  password,
  setPassword,
  placeholder = "Enter your password",
}: Props) {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.mediumTextBlack, { marginBottom: windowHeight(8) }]}>
        Password
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[commonStyles.regularText, styles.input]}
          placeholder={placeholder}
          placeholderTextColor={color.subtitle}
          secureTextEntry={isSecure}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.toggleButton}>
          <Text style={{ color: color.regularText }}>
            {isSecure ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  toggleButton: {
    marginLeft: 10,
  },
});
