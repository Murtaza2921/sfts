// const express = require("express");
// const { WebSocketServer } = require("ws");
// const geolib = require("geolib");

// const app = express();
// const PORT = 3000;

// // Store driver locations
// let drivers = {};

// // Store WebSocket connections by role and user IDs
// const connections = {};

// // Create WebSocket server
// const wss = new WebSocketServer({ port: 8080 });

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     try {
//       const data = JSON.parse(message);
//       console.log("Received message:", data); // Debugging line

//       // Handle location updates
//       if (data.type === "locationUpdate" && data.role === "driver") {
//         drivers[data.driver] = {
//           latitude: data.data.latitude,
//           longitude: data.data.longitude,
//         };
//         console.log("Updated driver location:", drivers[data.driver]); // Debugging line
//       }

//       // Handle ride requests
//       if (data.type === "requestRide" && data.role === "user") {
//         console.log("Requesting ride...");
//         const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
//         console.log("nearby Drivers:", nearbyDrivers);
//         ws.send(
//           JSON.stringify({ type: "nearbyDrivers", drivers: nearbyDrivers })
//         );
//       }

//       // Register user or driver connection
//       if (data.type === "register") {
//         const { userId, role } = data;
//         connections[userId] = { ws, role };
//         console.log(`${role} registered: ${userId}`);
//       }

//       // Handle chat messages
//       if (data.type === "chatMessage") {
//         const { senderId, receiverId, message } = data;
//         if (connections[receiverId]) {
//           connections[receiverId].ws.send(
//             JSON.stringify({
//               type: "chatMessage",
//               senderId,
//               message,
//               timestamp: new Date(),
//             })
//           );
//         } else {
//           console.log("Receiver not connected:", receiverId);
//         }
        
//       }

//       if (data.type === "joinRoom") {
    
//           const { roomId, userId, role } = message;
  
//           if (!roomId || !userId || !role) {
//             ws.send(JSON.stringify({ type: "error", message: "Invalid roomId, userId, or role" }));
//             return;
//           }
  
//           // Add the WebSocket to the room
//           if (!rooms.has(roomId)) {
//             rooms.set(roomId, []);
//           }
  
//           rooms.get(roomId).push(ws);
//           ws.roomId = roomId;
//           ws.userId = userId;
//           ws.role = role;
  
//           console.log(`${role} (${userId}) joined room ${roomId}.`);
//           ws.send(JSON.stringify({ type: "roomJoined", roomId }));
//       }
//       if (data.type === "sendMessage") {
//         const { roomId, userId, message: chatMessage } = message;

//         if (!roomId || !chatMessage) {
//           ws.send(JSON.stringify({ type: "error", message: "Invalid roomId or message" }));
//           return;
//         }

//         const roomMembers = rooms.get(roomId);

//         if (!roomMembers) {
//           ws.send(JSON.stringify({ type: "error", message: "Room does not exist" }));
//           return;
//         }

//         // Broadcast the message to all members of the room
//         roomMembers.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(
//               JSON.stringify({
//                 type: "newMessage",
//                 roomId,
//                 userId,
//                 message: chatMessage,
//                 timestamp: new Date().toISOString(),
//               })
//             );
//           }
//         });

//         console.log(`Message from ${userId} in room ${roomId}: ${chatMessage}`);
        
//       }
//     } catch (error) {
//       console.log("Failed to parse WebSocket message:", error);
//     }
//   });

//   ws.on("close", () => {
//     // Remove disconnected WebSocket from connections
//     for (const [userId, connection] of Object.entries(connections)) {
//       if (connection.ws === ws) {
//         delete connections[userId];
//         console.log(`${userId} disconnected`);
//         break;
//       }
//     }
//   });
// });

// const findNearbyDrivers = (userLat, userLon) => {
//   return Object.entries(drivers)
//     .filter(([id, location]) => {
//       const distance = geolib.getDistance(
//         { latitude: userLat, longitude: userLon },
//         location
//       );
//       return distance <= 5000; // 5 kilometers
//     })
//     .map(([id, location]) => ({ id, ...location }));
// };

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const { WebSocketServer } = require("ws");
const geolib = require("geolib");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// Store driver locations
let drivers = {};

// Store WebSocket connections by user ID
const connections = {};

// Manage rooms
const rooms = new Map();

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Utility functions
const addToRoom = (roomId, ws, userId, role) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, []);
  }

  const room = rooms.get(roomId);
  const existingMember = room.find((member) => member.ws === ws);

  if (!existingMember) {
    room.push({ ws, userId, role });
    ws.roomId = roomId;
    ws.userId = userId;
    ws.role = role;
    console.log(`${role} (${userId}) joined room ${roomId}`);
  }
};

const broadcastToRoom = (roomId, message, senderWs) => {
  const room = rooms.get(roomId);
  if (!room) {
    console.warn(`Room ${roomId} does not exist`);
    return;
  }

  room.forEach(({ ws }) => {
    if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending message to WebSocket:", error);
      }
    }
  });
};

const findNearbyDrivers = (userLat, userLon) => {
  return Object.entries(drivers)
    .filter(([id, location]) => {
      if (
        !location.latitude ||
        !location.longitude ||
        isNaN(location.latitude) ||
        isNaN(location.longitude)
      ) {
        console.warn(`Invalid location for driver ${id}`);
        return false;
      }

      const distance = geolib.getDistance(
        { latitude: userLat, longitude: userLon },
        location
      );
      return distance <= 5000; // 5 kilometers
    })
    .map(([id, location]) => ({ id, ...location }));
};

// WebSocket connection handler
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
      console.log("Received message:", data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON format" }));
      return;
    }

    switch (data.type) {
      case "locationUpdate":
        if (data.role === "driver") {
          drivers[data.driver] = {
            latitude: data.data.latitude,
            longitude: data.data.longitude,
          };
          console.log("Updated driver location:", drivers[data.driver]);
        }
        break;

      case "requestRide":
        if (data.role === "user") {
          const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
          console.log("Nearby drivers:", nearbyDrivers);
          try {
            ws.send(
              JSON.stringify({ type: "nearbyDrivers", drivers: nearbyDrivers })
            );
          } catch (error) {
            console.error("Error sending WebSocket message:", error);
          }
        }
        break;

      case "register":
        const { userId, role } = data;
        connections[userId] = { ws, role };
        console.log(`${role} registered: ${userId}`);
        break;

      case "joinRoom":
        const { roomId, userId: roomUserId, role: roomRole } = data;
        if (!roomId || !roomUserId || !roomRole) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid roomId, userId, or role",
            })
          );
          return;
        }
        addToRoom(roomId, ws, roomUserId, roomRole);
        ws.send(JSON.stringify({ type: "roomJoined", roomId }));
        break;

      case "sendMessage":
        const { roomId: msgRoomId, receiver: msgUserId, text: chatMessage } =
          data.message;

        if (!msgRoomId || !chatMessage) {
          ws.send(
            JSON.stringify({ type: "error", message: "Invalid roomId or message" })
          );
          return;
        }

        broadcastToRoom(
          msgRoomId,
          {
            type: "newMessage",
            roomId: msgRoomId,
            userId: msgUserId,
            message: chatMessage,
            timestamp: new Date().toISOString(),
          },
          ws
        );

        console.log(
          `Message from ${msgUserId} in room ${msgRoomId}: ${chatMessage}`
        );
        break;

      case "chatMessage":
        const { senderId, receiverId, message: directMessage } = data;
        if (connections[receiverId]) {
          connections[receiverId].ws.send(
            JSON.stringify({
              type: "chatMessage",
              senderId,
              message: directMessage,
              timestamp: new Date(),
            })
          );
        } else {
          console.log("Receiver not connected:", receiverId);
        }
        break;

      default:
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid message type" })
        );
        break;
    }
  });

  ws.on("close", () => {
    // Remove disconnected WebSocket from connections and rooms
    for (const [userId, connection] of Object.entries(connections)) {
      if (connection.ws === ws) {
        delete connections[userId];
        console.log(`${userId} disconnected`);
        break;
      }
    }

    if (ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        rooms.set(
          ws.roomId,
          room.filter((member) => member.ws !== ws)
        );
        console.log(`WebSocket removed from room ${ws.roomId}`);
      }
    }
  });
});

// HTTP server
app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:8080`);
});
