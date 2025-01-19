export const generateRoomId = (userId: string, driverId: string): string => {
  if (!userId || !driverId) {
    throw new Error("Both userId and driverId are required to generate a room ID.");
  }

  // Combine userId and driverId in a consistent order
  return [userId, driverId].sort().join("_");
};

  