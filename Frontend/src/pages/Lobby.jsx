import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { nanoid } from "nanoid";

const Lobby = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomIdParam = searchParams.get("roomId") || "";

  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState(roomIdParam);
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4">
      <div className="flex w-full flex-col items-center rounded-2xl bg-neutral-800 p-6 shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <img src="/logo.png" alt="CneMeet Logo" className="mb-3 w-16" />
        <h1 className="mb-6 text-center text-3xl font-bold text-amber-400">
          CneMeet
        </h1>

        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Create Room Section */}
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-neutral-200 placeholder-neutral-400 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <button
            type="button"
            onClick={handleCreateRoom}
            className="w-full rounded-md bg-amber-400 py-2 font-semibold text-neutral-900 transition hover:bg-amber-500"
          >
            Generate Room
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
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
            className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-neutral-200 placeholder-neutral-400 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <button
            type="button"
            onClick={handleJoinRoom}
            className="w-full rounded-md border border-amber-400 bg-transparent py-2 font-semibold text-amber-400 transition hover:bg-amber-100 hover:text-neutral-900"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
