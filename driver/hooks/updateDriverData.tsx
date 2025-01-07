import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const useUpdateDriverData = () => {
  const updateDriver = async (updatedData: Partial<DriverType>) => {
    try {
      
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/driver/me`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data; // Return updated driver data or status
    } catch (error) {
      console.error("Error updating driver:", error);
      throw error;
    }
  };

  return { updateDriver };
};
