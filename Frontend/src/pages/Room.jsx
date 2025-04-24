import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";

// Connect to socket server
const socket = io("http://localhost:5000");

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Step 1: Get user media (video + audio)
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

  // Step 2: Connect to socket server
  useEffect(() => {
    const setup = () => {
      socket.on("connect", () => {
        console.log("✅ Connected to socket server:", socket.id);
      });
    };

    setup();
  }, []);

  // Step 3 & 4: Join room and handle user-joined only after stream is ready
  useEffect(() => {
    if (!stream) return;

    const userName = location.state?.name || "Anonymous";
    socket.emit("join-room", { roomId, userName });
    console.log(
      `📨 Join room emitted for roomId: ${roomId} with userName: ${userName}`
    );

    // Step 4.1: Handle new user joined
    socket.on("user-joined", async ({ socketId: remoteSocketId, userName }) => {
      console.log(`👤 ${userName} joined with socket ID: ${remoteSocketId}`);

      // Step 4.2: Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peerConnection;

      // Step 4.3: Add local stream to peer
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Step 4.4: Handle ICE candidate and send to remote user
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: remoteSocketId,
            candidate: event.candidate,
          });
        }
      };

      // Step 4.5: (Optional) Handle remote track
      peerConnection.ontrack = (event) => {
        console.log("📹 Received remote track:", event.streams);
        // Attach `event.streams[0]` to remote video element if needed
      };

      // Step 4.6: Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("offer", {
        to: remoteSocketId,
        offer,
      });

      console.log("📤 Sent offer to", remoteSocketId);
    });

    // Clean up socket events when unmounting
    return () => {
      socket.off("user-joined");
    };
  }, [stream, roomId, location.state?.name]);

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
