import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid"; // npm install nanoid

const Lobby = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!name.trim()) return;
    const newRoomId = nanoid(8);
    navigate(`/room/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) return;
    navigate(`/room/${roomId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
      <div className="bg-neutral-800 rounded-2xl shadow-lg p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 flex flex-col items-center">
        <img src="/logo.png" alt="CneMeet Logo" className="w-16 mb-3" />
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-6">CneMeet</h1>

        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Create Room Section */}
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-700 border border-neutral-600 text-neutral-200 placeholder-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition w-full"
            required
          />

          <button
            type="button"
            onClick={handleCreateRoom}
            className="bg-amber-400 hover:bg-amber-500 text-neutral-900 font-semibold py-2 rounded-md transition w-full"
          >
            Generate Room
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center text-neutral-400 text-sm gap-2">
            <span className="w-1/4 border-t border-neutral-600" />
            or
            <span className="w-1/4 border-t border-neutral-600" />
          </div>

          {/* Join Room Section */}
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="bg-neutral-700 border border-neutral-600 text-neutral-200 placeholder-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition w-full"
            required
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
};

export default Lobby;
