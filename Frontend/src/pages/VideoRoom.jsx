  import React, { useState, useEffect } from "react";
  import { useLocation, useNavigate, useParams } from "react-router-dom";
  import VideoCall from "../components/VideoCall";
  import { AgoraProvider } from "../context/AgoraContext";
  import { useAgora } from "../context/AgoraContext";
  import ControlBar from "../components/ControlBar";
  import toast from "react-hot-toast";
  import { ref, push, onValue, remove, get, child } from "firebase/database";
  import { db } from "../firebase";


  const VideoRoom = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const name = params.get("name") || "Guest";

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [showChat, setShowChat] = useState(true);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(db, `rooms/${roomId}/chatMessages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgList);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await push(ref(db, `rooms/${roomId}/chatMessages`), {
      text: message.trim(),
      sender: name || "Anonymous",
      timestamp: Date.now(),
    });

    setMessage("");
  };

    const handleLeave = async () => {
      await leaveRoom();
      navigate("/");
    };
    
    useEffect(() => {
      if (!roomId || !name) {
        navigate("/"); // redirect to lobby if info is missing
      }
    }, [roomId, name, navigate]);


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
            message={message}
            setMessage={setMessage}
            messages={messages}
            sendMessage={sendMessage}
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
    message,
    setMessage,
    messages,
    sendMessage,
  }) => {
    const { leaveRoom, localTracks } = useAgora();
    const host = import.meta.env.VITE_HOST;


    const handleLeave = async () => {
      await leaveRoom();
      navigate("/");
    };

    const handleMic = () => {
      if (localTracks.current.audioTrack) {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localTracks.current.audioTrack.setEnabled(!newMuted); // ← mute/unmute mic
      }
    };

    const handleCopy = () => {
      if (roomId) {
        const joinUrl = host + "?roomId=" + roomId;
        navigator.clipboard.writeText(joinUrl);
        toast.success("Invite link copied!");
      }
    }
    const handleCamera = () =>{
      if (localTracks.current.videoTrack) {
      const newVideoOff = !isVideoOff;
      setIsVideoOff(newVideoOff);
      localTracks.current.videoTrack.setEnabled(!newVideoOff); // ← turn on/off cam
    } 
  }
    const handleScreenShare = () => alert("Screen sharing coming soon...");

    return (
        <div className="flex min-h-screen w-screen flex-col bg-neutral-900 font-sans text-white">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-600 bg-neutral-800 px-4 py-3 shadow-lg sm:px-6 sm:py-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/logo.png"
                alt="CneMeet Logo"
                className="h-9 w-9 rounded-md sm:h-10 sm:w-10"
              />
              <h1 className="text-xl font-bold tracking-wide text-amber-400 sm:text-2xl">
                Cne Meet
              </h1>
            </div>

            {/* Room Info and Leave */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-xs text-neutral-300 sm:text-sm">👋 Hi, {name}</span>

              <div className="flex items-center gap-2 rounded-md bg-neutral-700 px-2 py-1 sm:px-3">
                <span className="text-[10px] text-amber-300 sm:text-xs">Room ID:</span>
                <span className="font-mono text-[10px] text-white sm:text-xs">{roomId}</span>
                <button
                  onClick={handleCopy}
                  title="Copy Room ID"
                  className="rounded bg-amber-400 px-2 py-1 text-[10px] text-neutral-900 transition hover:bg-amber-500 sm:text-xs"
                >
                  Copy
                </button>
              </div>

              <button
                onClick={handleLeave}
                className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium transition hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
              >
                Leave
              </button>
            </div>
          </header>

          {/* Main Area */}
          <main className="flex flex-1 flex-col overflow-hidden sm:flex-row">
            {/* Video Grid */}
            <section className="flex-1 overflow-y-auto p-3 sm:p-4">
              <VideoCall />
            </section>

            {/* Chat Panel */}
            {showChat && (
              <aside className="flex w-full flex-col justify-between border-t border-neutral-800 bg-neutral-800 p-3 sm:w-80 sm:border-l sm:border-t-0 sm:p-4">
                <div>
                  <h2 className="mb-3 border-b border-neutral-700 pb-2 text-base font-semibold text-amber-400 sm:text-lg">
                    Chat Room
                  </h2>
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 text-sm">
                    {messages.map((msg, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-amber-300 font-semibold">{msg.sender}</span>
                        <span className="text-white">{msg.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1 rounded-l-md bg-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none"
                      placeholder="Type a message..."
                    />
                    <button onClick={sendMessage} className="rounded-r-md bg-amber-400 px-4 py-2 font-medium text-neutral-900 transition hover:bg-amber-500">
                      Send
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </main>

          {/* Bottom Controls */}
          <div className="sticky bottom-0 z-10 w-full bg-neutral-900 shadow-inner">
            <ControlBar
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              onToggleMic={handleMic}
              onToggleVideo={handleCamera}
              onToggleScreen={handleScreenShare}
              onToggleChat={() => setShowChat((prev) => !prev)}
            />
          </div>
        </div>

    );
  };

  export default VideoRoom;
