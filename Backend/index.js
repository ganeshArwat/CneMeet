const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all during development
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

  // Forward the offer from the initiator to the answerer
  socket.on("offer", ({ from, offer }) => {
    console.log("📩 Received offer from", from);
    socket.to(from).emit("offer", {
      from: socket.id,
      offer,
    });
  });

  // Forward the answer from the answerer back to the initiator
  socket.on("answer", ({ to, answer }) => {
    console.log("📩 Received answer from", socket.id);
    socket.to(to).emit("answer", {
      from: socket.id,
      answer,
    });
  });

  // Forward ICE candidates
  socket.on("ice-candidate", ({ to, candidate }) => {
    console.log("📩 Forwarding ICE candidate from", socket.id);
    socket.to(to).emit("ice-candidate", {
      from: socket.id,
      candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Socket server running on http://localhost:5000");
});
