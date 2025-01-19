import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const useUpdateUserData = () => {
  const updateUser = async (updatedData: Partial<UserType>) => {
    try {
      
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/user/me`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data; // Return updated driver data or status
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return { updateUser };
};
