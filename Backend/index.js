const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your Vite dev server
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // listen for join-room event from client
  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);
    console.log(`${name} joined room ${roomId}`);

    // Inform others in the room
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userName: name
    });
  });

  // listen for Disconnect event from client
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Socket server listening on http://localhost:5000");
});
