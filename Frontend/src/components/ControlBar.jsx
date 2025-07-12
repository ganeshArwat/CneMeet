// src/components/ControlBar.jsx
import React from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaComments,
} from "react-icons/fa";

const ControlBar = ({
  isMuted,
  isVideoOff,
  onToggleMic,
  onToggleVideo,
  onToggleScreen,
  onToggleChat,
}) => {
  return (
    <div className="flex justify-center items-center gap-6 py-4 bg-neutral-800 border-t border-neutral-600 shadow-lg">
      {/* Mic */}
      <button
        onClick={onToggleMic}
        className={`text-xl p-3 rounded-full ${
          isMuted ? "bg-red-600 text-white" : "bg-stone-600 text-white"
        } hover:scale-105 transition`}
      >
        {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
      </button>

      {/* Video */}
      <button
        onClick={onToggleVideo}
        className={`text-xl p-3 rounded-full ${
          isVideoOff ? "bg-red-600 text-white" : "bg-stone-600 text-white"
        } hover:scale-105 transition`}
      >
        {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
      </button>

      {/* Chat */}
      <button
        onClick={onToggleChat}
        className="text-xl p-3 rounded-full bg-stone-600 text-white hover:scale-105 transition"
      >
        <FaComments />
      </button>
    </div>
  );
};

export default ControlBar;
