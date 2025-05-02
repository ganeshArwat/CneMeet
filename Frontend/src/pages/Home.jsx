import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "../providers/SocketProvider";

function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleCreateRoom = useCallback(
    (e) => {
      e.preventDefault();
      if (!name) return;
      const id = uuidv4();
      setRoom(id);
      socket.emit("room:join", { userName: name, room: id });
    },
    [name, socket]
  );

  const handleJoinRoom = useCallback(
    (e) => {
      e.preventDefault();
      if (!room || !name) return;
      if (room) {
        socket.emit("room:join", { userName: name, room });
      }
    },
    [room, name, socket]
  );

  const handleRoomJoined = useCallback(
    ({ userName, room, socketId }) => {
      navigate(`/room/${room}`, { state: { name, socketId } });
    },
    [navigate, name]
  );

  useEffect(() => {
    socket.on("room:join", handleRoomJoined);

    return () => {
      socket.off("room:join", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="bg-neutral-800 rounded-2xl shadow-lg p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col items-center">
        <img src="logo.png" alt="CneMeet Logo" className="w-16 mb-3" />

        <h1 className="text-3xl font-bold text-amber-400 text-center mb-6">CneMeet</h1>

        <form className="flex flex-col gap-4 w-full">
          {/* Create Room */}
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            className="bg-neutral-700 border border-neutral-600 text-neutral-200 placeholder-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition w-full"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="button"
            onClick={handleCreateRoom}
            className="bg-amber-400 hover:bg-amber-500 text-neutral-900 font-semibold py-2 rounded-md transition w-full"
          >
            Generate Room
          </button>

          <div className="flex items-center justify-center text-neutral-400 text-sm gap-2">
            <span className="w-1/4 border-t border-neutral-600" />
            or
            <span className="w-1/4 border-t border-neutral-600" />
          </div>

          {/* Join Room */}
          <input
            type="text"
            name="UserName"
            id="UserName"
            placeholder="Enter your name"
            className="bg-neutral-700 border border-neutral-600 text-neutral-200 placeholder-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition w-full"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            name="room"
            id="room"
            placeholder="Enter Room ID"
            className="bg-neutral-700 border border-neutral-600 text-neutral-200 placeholder-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition w-full"
            required
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button
            type="button"
            onClick={handleJoinRoom}
            className="bg-transparent border border-amber-400 text-amber-400 hover:bg-amber-100 hover:text-neutral-900 font-semibold py-2 rounded-md transition w-full"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>

  );
}

export default Home;
