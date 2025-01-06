const express = require("express");
const { WebSocketServer } = require("ws");
const geolib = require("geolib");

const app = express();
const PORT = 3000;

// Store driver locations
let drivers = {};

// Store WebSocket connections by role and user IDs
const connections = {};

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data); // Debugging line

      // Handle location updates
      if (data.type === "locationUpdate" && data.role === "driver") {
        drivers[data.driver] = {
          latitude: data.data.latitude,
          longitude: data.data.longitude,
        };
        console.log("Updated driver location:", drivers[data.driver]); // Debugging line
      }

      // Handle ride requests
      if (data.type === "requestRide" && data.role === "user") {
        console.log("Requesting ride...");
        const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
        console.log("nearby Drivers:", nearbyDrivers);
        ws.send(
          JSON.stringify({ type: "nearbyDrivers", drivers: nearbyDrivers })
        );
      }

      // Register user or driver connection
      if (data.type === "register") {
        const { userId, role } = data;
        connections[userId] = { ws, role };
        console.log(`${role} registered: ${userId}`);
      }

      // Handle chat messages
      if (data.type === "chatMessage") {
        const { senderId, receiverId, message } = data;
        if (connections[receiverId]) {
          connections[receiverId].ws.send(
            JSON.stringify({
              type: "chatMessage",
              senderId,
              message,
              timestamp: new Date(),
            })
          );
        } else {
          console.log("Receiver not connected:", receiverId);
        }
      }
    } catch (error) {
      console.log("Failed to parse WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    // Remove disconnected WebSocket from connections
    for (const [userId, connection] of Object.entries(connections)) {
      if (connection.ws === ws) {
        delete connections[userId];
        console.log(`${userId} disconnected`);
        break;
      }
    }
  });
});

const findNearbyDrivers = (userLat, userLon) => {
  return Object.entries(drivers)
    .filter(([id, location]) => {
      const distance = geolib.getDistance(
        { latitude: userLat, longitude: userLon },
        location
      );
      return distance <= 5000; // 5 kilometers
    })
    .map(([id, location]) => ({ id, ...location }));
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
