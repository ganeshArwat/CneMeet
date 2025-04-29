const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

// Use PORT from environment or fallback
const PORT = 5000;

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust CORS rules as per your frontend
  },
});

const userNameToSocket = new Map();
const socketidToUserNameMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { userName, room } = data;
    userNameToSocket.set(userName, socket.id);
    socketidToUserNameMap.set(socket.id, userName);
    io.to(room).emit("user:joined", { userName, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", { ...data, socketId: socket.id });
  });

  socket.on("user:call", ({ to, fromName, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, fromName, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("chat:message", ({ message, to }) => {
    io.to(to).emit("chat:message", { message, from: socket.id });
  });

  socket.on("call:ended", ({ to }) => {
    console.log("call:ended", to);
    io.to(to).emit("call:ended", { from: socket.id });
  });
});

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
