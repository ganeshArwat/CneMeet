// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all during development
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`🚪 ${userName} joined room: ${roomId}`);

    // Notify others in the room
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userName,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Socket server running on http://localhost:5000");
});
