import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

// Define UserType
interface UserType {
  name: string;
  email: string;
  phone_number: string;
  emergency_contact_name?: string; // Optional fields
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
}

export const useGetUserData = () => {
  const [user, setUser] = useState<UserType | null>(null); // Adjusted to handle null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoggedInUserData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) throw new Error("Access token not found");

        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getLoggedInUserData();
  }, []);

  return { user, loading };
};
