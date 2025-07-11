import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import { AgoraProvider } from "../context/AgoraContext";
import ControlBar from "../components/ControlBar";

const VideoRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Guest";

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const handleMic = () => setIsMuted((prev) => !prev);
  const handleCamera = () => setIsVideoOff((prev) => !prev);
  const handleScreenShare = () => alert("Screen sharing coming soon...");

  return (
    <AgoraProvider userName={name}>
      <div className="min-h-screen w-screen bg-neutral-900 text-white flex flex-col font-sans">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-neutral-800 border-b border-neutral-600 shadow-lg">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="CneMeet Logo" className="w-10 h-10 rounded-md" />
            <h1 className="text-2xl font-bold tracking-wide text-amber-400">
              Cne Meet
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-300">👋 Hi, {name}</span>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md text-sm font-medium"
            >
              Leave
            </button>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Video Grid */}
          <section className="flex-1 p-4 overflow-y-auto bg-neutral-900">
            <VideoCall />
          </section>

          {/* Chat Panel */}
          {showChat && (
            <aside className="w-full md:w-80 bg-neutral-800 border-l border-neutral-800 p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-amber-400 mb-3 border-b pb-2 border-neutral-700">
                  Chat Room
                </h2>
                {/* Message list here */}
                <div className="text-neutral-400 text-sm">Coming soon...</div>
              </div>

              <div className="mt-4">
                <div className="flex">
                  <input
                    className="flex-1 px-3 py-2 rounded-l-md bg-neutral-700 text-sm text-white placeholder-neutral-400 focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button className="bg-amber-400 hover:bg-amber-500 text-neutral-900 px-4 py-2 rounded-r-md font-medium transition">
                    Send
                  </button>
                </div>
              </div>
            </aside>
          )}
        </main>

        {/* Bottom Controls */}
        <ControlBar
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMic={handleMic}
          onToggleVideo={handleCamera}
          onToggleScreen={handleScreenShare}
          onToggleChat={() => setShowChat((prev) => !prev)}
        />
      </div>
    </AgoraProvider>
  );
};

export default VideoRoom;
