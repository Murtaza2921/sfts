import React, { useEffect, useState } from "react";
import "react-native-get-random-values";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Import SafeAreaProvider

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // flag to check if the component is mounted

    const getData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (isMounted) {
          setIsLoggedIn(!!accessToken);
        }
      } catch (error) {
        console.log(
          "Failed to retrieve access token from async storage",
          error
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Redirect href={!isLoggedIn ? "/(routes)/login" : "/(tabs)/home"} />
    </SafeAreaProvider>
  );
}
