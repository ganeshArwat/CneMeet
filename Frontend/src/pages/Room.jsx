import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../providers/SocketProvider";
import VideoRoom from "../components/VideoRoom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatRoom from "../components/ChatRoom";
import Header from "../components/Header";
import toast from "react-hot-toast";

ReactPlayer;
const RoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { state } = useLocation();

  const [localSocketId] = useState(state?.socketId);
  const [localUserName] = useState(state?.name);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteUserName, setRemoteUserName] = useState(null);
  const [initialCall, setInitialCall] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);



  // Helpers
  const setupMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setMyStream(stream);
    return stream;
  };

  const sendStreams = useCallback(() => {
    if (!myStream) return;
    myStream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, myStream);
    });
  }, [myStream]);

  // Socket Events Handlers
  const handleUserJoined = useCallback(({ userName, id }) => {
    setRemoteSocketId(id);
    setRemoteUserName(userName);
    setInitialCall(true);
    toast.success(`${userName} joined the room`);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await setupMediaStream();
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, fromName: localUserName, offer });
  }, [remoteSocketId, localUserName, socket]);


  const handleIncomingCall = useCallback(async ({ from, fromName, offer }) => {
    setRemoteSocketId(from);
    setRemoteUserName(fromName);
    const stream = await setupMediaStream();
    const answer = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans: answer });
    toast.success(`${fromName} joined the room`);
  }, [socket]);

  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    sendStreams();
  }, [sendStreams]);

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegotiationIncoming = useCallback(async ({ from, offer }) => {
    const answer = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans: answer });
  }, [socket]);

  const handleNegotiationFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);


  // Video Controls
  const disconnectCall = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
      setRemoteStream(null);
      setRemoteSocketId(null);
      socket.emit("call:ended", { to: remoteSocketId });
      navigate("/");
    }
  }, [myStream, remoteSocketId, socket, navigate]);


  const toggleVideo = useCallback(() => {
    if (!myStream) return;
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setVideoOn((prev) => !prev);
  }, [myStream]);

  const toggleAudio = useCallback(() => {
    if (!myStream) return;
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setAudioOn((prev) => !prev);
  }, [myStream]);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => !prev);
  }, []);

  // Chat Controls
  const sendMessage = useCallback((message) => {
    socket.emit("chat:message", { message, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleMessageReceived = useCallback(({ message }) => {
    setMessages((prevMessages) => [...prevMessages, { ...message, type: "received" }]);
  }, []);


  // Screen Sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(screen);

      const videoTrack = screen.getVideoTracks()[0];
      const videoSender = peer.peer.getSenders().find(s => s.track?.kind === 'video');

      if (videoSender) {
        await videoSender.replaceTrack(videoTrack);
      }

      setIsScreenSharing(true);

      // Optionally pause the camera track (don't stop it)
      const cameraTrack = myStream?.getVideoTracks()[0];
      if (cameraTrack) {
        cameraTrack.enabled = false;
      }

    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  }, [peer.peer, myStream]);

  const stopScreenShare = useCallback(async () => {
    if (!screenStream) return;

    try {
      // Stop the screen sharing tracks
      screenStream.getTracks().forEach((track) => track.stop());

      // Get the current video track from myStream
      const cameraTrack = myStream?.getVideoTracks()[0];

      // If we don't have a camera track, get a new stream
      if (!cameraTrack) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        setMyStream(newStream);

        // Replace the video track with the new camera track
        const newVideoTrack = newStream.getVideoTracks()[0];
        const videoSender = peer.peer.getSenders().find(s => s.track?.kind === 'video');
        if (videoSender && newVideoTrack) {
          await videoSender.replaceTrack(newVideoTrack);
        }
      } else {
        // We have a camera track, just replace the screen track with it
        const videoSender = peer.peer.getSenders().find(s => s.track?.kind === 'video');
        if (videoSender && cameraTrack) {
          await videoSender.replaceTrack(cameraTrack);
        }
      }

      // Clean up and reset states
      setScreenStream(null);
      setIsScreenSharing(false);

      myStream.getVideoTracks().forEach((track) => (track.enabled = true));
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }, [screenStream, myStream, peer.peer]);

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  // Effects
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    if (remoteSocketId && initialCall && !myStream) {
      handleCallUser();
    }
  }, [remoteSocketId, initialCall, myStream, handleCallUser]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);
    socket.on("call:ended", disconnectCall);
    socket.on("chat:message", handleMessageReceived);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
      socket.off("call:ended", disconnectCall);
      socket.off("chat:message", handleMessageReceived);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationIncoming,
    handleNegotiationFinal,
    disconnectCall,
    handleMessageReceived
  ]);

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      const [stream] = ev.streams;
      setInitialCall(true);
      setRemoteStream(stream);
    });
  }, []);

  useEffect(() => {
    if (initialCall && myStream) {
      sendStreams();
    }
  }, [initialCall, myStream, sendStreams]);



  return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header roomId={roomId} />

        <div className="flex-grow grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 p-4 overflow-auto">
          <VideoRoom
            myStream={myStream}
            localUserName={localUserName}
            remoteStream={remoteStream}
            remoteUserName={remoteUserName}
            toggleVideo={toggleVideo}
            videoOn={videoOn}
            toggleAudio={toggleAudio}
            audioOn={audioOn}
            disconnectCall={disconnectCall}
            toggleScreenShare={toggleScreenShare}
            isScreenSharing={isScreenSharing}
            screenStream={screenStream}
            isPinned={isPinned}
            togglePin={togglePin}
          />

          <ChatRoom
            sendMessage={sendMessage}
            setMessages={setMessages}
            messages={messages}
          />
        </div>
      </div>
  );
};

export default RoomPage;
