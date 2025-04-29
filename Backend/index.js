const { Server } = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000; // 👈 important
const server = http.createServer(); // Create empty server

// const io = new Server(5000, {
//   cors: true,
// });

const io = new Server(server, {
  cors: {
    origin: "*", // You can later restrict it to your frontend URL
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


// Start server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});