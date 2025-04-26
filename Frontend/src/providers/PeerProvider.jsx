// src/providers/PeerProvider.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useSocket } from "./SocketProvider";

const PeerContext = createContext();

export function PeerProvider({ children }) {
  const { socket } = useSocket();
  const [remoteUser, setRemoteUser] = useState(null);

  // 1) Create one RTCPeerConnection, re-created only if `socket` or
  //    `remoteUser` changes (so that onicecandidate can see the latest).
  const peer = useMemo(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
      ],
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && remoteUser) {
        // send every new ICE candidate to the other side
        socket.emit("ice-candidate", { to: remoteUser, candidate });
      }
    };

    return pc;
  }, [socket, remoteUser]);

  // 2) Listen for ICE candidates from the remote peer
  useEffect(() => {
    const handler = async ({ candidate }) => {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("✅ Added ICE candidate");
      } catch (err) {
        console.error("❌ Error adding ICE candidate", err);
      }
    };

    socket.on("ice-candidate", handler);
    return () => {
      socket.off("ice-candidate", handler);
    };
  }, [socket, peer]);

  // 3) Offer / Answer methods.  Each takes a `toUser` so that ICE
  //    knows where to route.
  const createOffer = async (toUser) => {
    setRemoteUser(toUser);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("▶️ After setLocalDescription:", peer.signalingState); // have-local-offer
    return offer;
  };

  const createAnswer = async (offer, toUser) => {
    setRemoteUser(toUser);
    // wrap in RTCSessionDescription for safety
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log("🛎️ After creating answer, signalingState:", peer.signalingState); // stable
    return answer;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(new RTCSessionDescription(ans));
    console.log("✅ Caller after setRemoteDescription:", peer.signalingState);
  };

  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAns }}
    >
      {children}
    </PeerContext.Provider>
  );
}

export const usePeer = () => {
  return useContext(PeerContext);
};
