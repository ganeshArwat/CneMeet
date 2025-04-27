import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../providers/SocketProvider";
import VideoRoom from "../components/VideoRoom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Video from "../components/Video";
import ChatRoom from "../components/ChatRoom";
import Header from "../components/Header";

ReactPlayer;
const RoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { socket } = useSocket();
  const myName = useLocation().state?.name;
  const mySocketId = useLocation().state?.socketId;

  const [localSocketId, setLocalSocketId] = useState(mySocketId);
  const [localUserName, setLocalUserName] = useState(myName);
  const [myStream, setMyStream] = useState();
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteUserName, setRemoteUserName] = useState(null);
  const [remoteStream, setRemoteStream] = useState();

  const [intialCall, setInitialCall] = useState(false);

  const handleUserJoined = useCallback(({ userName, id }) => {
    console.log(`User ${userName} joined room`);
    setRemoteSocketId(id);
    setRemoteUserName(userName);
    setInitialCall(true);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", {
      to: remoteSocketId,
      fromName: localUserName,
      offer,
    });
    setMyStream(stream);
  }, [remoteSocketId, socket, localUserName]);

  useEffect(() => {
    if (remoteSocketId && intialCall && !myStream) {
      handleCallUser();
    }
  }, [remoteSocketId, myStream, handleCallUser]);

  const handleIncommingCall = useCallback(
    async ({ from, fromName, offer }) => {
      setRemoteSocketId(from);
      setRemoteUserName(fromName);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams, socket]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoOn((prev) => !prev);
    }
  };

  const toggleAudio = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioOn((prev) => !prev);
    }
  };

  const disconnectCall = () => {
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop(); // Stop each track (video + audio)
      });
      setMyStream(null); // Clear the stream from state
      setRemoteStream(null); // Clear the remote stream from state
      setRemoteSocketId(null);
      socket.emit("call:ended", { to: remoteSocketId });
      navigate("/"); // Navigate to the home page or any other page
    }
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setInitialCall(true);
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    if (intialCall && myStream) {
      sendStreams();
    }
  }, [intialCall, myStream, sendStreams]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("call:ended", disconnectCall)

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("call:ended", disconnectCall)
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  useEffect(() => {
    if (!remoteSocketId) return;
  }, [remoteSocketId]);




  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col h-screen bg-gray-900">
          <Header roomId={roomId} />
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-[4fr_2fr] gap-4 p-4">
            <VideoRoom myStream={myStream} localUserName={localUserName} remoteStream={remoteStream} remoteUserName={remoteUserName} toggleVideo={toggleVideo} videoOn={videoOn} toggleAudio={toggleAudio} audioOn={audioOn} disconnectCall={disconnectCall}  ></VideoRoom>
            <ChatRoom />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomPage;
