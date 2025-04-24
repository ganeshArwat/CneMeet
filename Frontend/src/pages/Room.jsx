import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Room() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const localVideoRef = useRef(null);
  const hasInitialized = useRef(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
        console.log("🎥 Media stream obtained");
      } catch (err) {
        console.error("❌ Error getting media", err);
      }
    };

    getMedia();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
      const userName = location.state?.name || "Anonymous";
      socket.emit("join-room", { roomId, userName });
      console.log(
        `📨 Join room emitted for roomId: ${roomId} with userName: ${userName}`
      );
    });

    socket.on("user-joined", ({ socketId, userName }) => {
      console.log(`👤 ${userName} joined with socket ID: ${socketId}`);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [roomId, location.state?.name]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Room: {roomId}</h1>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="rounded-md w-96 border-2 border-yellow-500"
      />
    </div>
  );
}

export default Room;
