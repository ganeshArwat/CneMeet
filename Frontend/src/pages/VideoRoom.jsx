import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import { AgoraProvider } from "../context/AgoraContext";
import { useAgora } from "../context/AgoraContext";
import ControlBar from "../components/ControlBar";

const VideoRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Guest";

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const handleLeave = async () => {
    await leaveRoom();
    navigate("/");
  };
  
  useEffect(() => {
    if (!roomId || !name) {
      navigate("/"); // redirect to lobby if info is missing
    }
  }, [roomId, name, navigate]);

  const handleMic = () => setIsMuted((prev) => !prev);
  const handleCamera = () => setIsVideoOff((prev) => !prev);
  const handleScreenShare = () => alert("Screen sharing coming soon...");

  return (
    <AgoraProvider userName={name} roomId={roomId}>
       <VideoRoomContent
          name={name}
          roomId={roomId}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          showChat={showChat}
          setIsMuted={setIsMuted}
          setIsVideoOff={setIsVideoOff}
          setShowChat={setShowChat}
          navigate={navigate}
        />

    </AgoraProvider>
  );
};


const VideoRoomContent = ({
  name,
  roomId,
  isMuted,
  isVideoOff,
  showChat,
  setIsMuted,
  setIsVideoOff,
  setShowChat,
  navigate,
}) => {
  const { leaveRoom } = useAgora();

  const handleLeave = async () => {
    await leaveRoom();
    navigate("/");
  };

  const handleMic = () => setIsMuted((prev) => !prev);
  const handleCamera = () => setIsVideoOff((prev) => !prev);
  const handleScreenShare = () => alert("Screen sharing coming soon...");

  return (
          <div className="flex min-h-screen w-screen flex-col bg-neutral-900 font-sans text-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-600 bg-neutral-800 px-6 py-4 shadow-lg">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="CneMeet Logo"
              className="h-10 w-10 rounded-md"
            />
            <h1 className="text-2xl font-bold tracking-wide text-amber-400">
              Cne Meet
            </h1>
          </div>

          {/* Room Info and Leave */}
          <div className="flex items-center gap-4">
            {/* 👋 User Greeting */}
            <span className="text-sm text-neutral-300">👋 Hi, {name}</span>

            {/* 📎 Room ID with Copy */}
            <div className="flex items-center gap-2 rounded-md bg-neutral-700 px-3 py-1">
              <span className="text-xs text-amber-300">Room ID:</span>
              <span className="font-mono text-xs text-white">{roomId}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                }}
                title="Copy Room ID"
                className="rounded bg-amber-400 px-2 py-1 text-xs text-neutral-900 transition hover:bg-amber-500"
              >
                Copy
              </button>
            </div>

            {/* Leave Button */}
            <button
              onClick={handleLeave}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-700"
            >
              Leave
            </button>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Video Grid */}
          <section className="flex-1 overflow-y-auto bg-neutral-900 p-4">
            <VideoCall />
          </section>

          {/* Chat Panel */}
          {showChat && (
            <aside className="flex w-full flex-col justify-between border-l border-neutral-800 bg-neutral-800 p-4 md:w-80">
              <div>
                <h2 className="mb-3 border-b border-neutral-700 pb-2 text-lg font-semibold text-amber-400">
                  Chat Room
                </h2>
                {/* Message list here */}
                <div className="text-sm text-neutral-400">Coming soon...</div>
              </div>

              <div className="mt-4">
                <div className="flex">
                  <input
                    className="flex-1 rounded-l-md bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none"
                    placeholder="Type a message..."
                  />
                  <button className="rounded-r-md bg-amber-400 px-4 py-2 font-medium text-neutral-900 transition hover:bg-amber-500">
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
  );
};

export default VideoRoom;
