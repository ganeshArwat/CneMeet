import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../providers/SocketProvider";
import VideoRoom from "../components/VideoRoom";
import { useLocation, useParams } from "react-router-dom";
import Video from "../components/Video";

ReactPlayer;
const RoomPage = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const myName = useLocation().state.name;
  const mySocketId = useLocation().state.socketId;

  const [localSocketId, setLocalSocketId] = useState(mySocketId);
  const [localUserName, setLocalUserName] = useState(myName);
  const [myStream, setMyStream] = useState();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [RemoteUserName, setRemoteUserName] = useState(null);
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ userName, id }) => {
    console.log(`User ${userName} joined room`);
    setRemoteSocketId(id);
    setRemoteUserName(userName);
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
    if (remoteSocketId && !myStream) {
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
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

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
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
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
      {/* <div>
        {myStream && <button onClick={sendStreams}>Send Stream</button>}
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      </div> */}
      <VideoRoom>
        <div className="mb-4 flex justify-between">
          <span className="text-xl font-bold m-4">Room ID: {roomId}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Video stream={myStream} UserName={"You"} />
          <Video stream={remoteStream} UserName={RemoteUserName} />
        </div>
      </VideoRoom>
    </>
  );
};

export default RoomPage;
