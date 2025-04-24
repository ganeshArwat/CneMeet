import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name || "Guest";

  const [stream, setStream] = useState(null);
  const [socket, setSocket] = useState(null);

  const myVideoRef = useRef(null);

  // Step 1: Get Media Stream
  useEffect(() => {
    const startStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream); // Set stream in state

        // Set the stream for the user's video element
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }

      // Connect socket
      const newSocket = io("http://localhost:5000"); // or your server URL
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    };
    startStream();
  }, []);

  useEffect(() => {
    if (socket && stream) {
      socket.emit("join-room", { roomId, name });
    }
  }, [socket, stream, roomId, name]);

  return (
    <div>
      <h1>Room: {roomId}</h1>
      {/* User's video element */}
      <video
        ref={myVideoRef}
        autoPlay
        muted
        playsInline
        className="w-1/2 border-4 border-blue-500 rounded-xl shadow-lg"
      />
    </div>
  );
}

export default Room;
