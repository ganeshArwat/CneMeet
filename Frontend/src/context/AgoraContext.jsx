// src/context/AgoraContext.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { appId, token, channelName } from "../agora/AgoraConfig";

const AgoraContext = createContext();

export const useAgora = () => useContext(AgoraContext);

export const AgoraProvider = ({ children, userName }) => {
  const client = useRef(null);
  const localTracks = useRef({ audioTrack: null, videoTrack: null });
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      await client.current.join(appId, channelName, token || null, null);

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks.current = { audioTrack: mic, videoTrack: cam };

      await client.current.publish([mic, cam]);

      setUsers([
        {
          uid: "local",
          videoTrack: cam,
          audioTrack: mic,
          name: userName || "You",
        },
      ]);

      // 🔁 Sync remote users
      client.current.remoteUsers.forEach(async (user) => {
        if (user.hasVideo) await client.current.subscribe(user, "video");
        if (user.hasAudio) await client.current.subscribe(user, "audio");

        setUsers((prev) => [...prev, user]);
        user.audioTrack?.play();
      });

      client.current.on("user-published", async (user, mediaType) => {
            await client.current.subscribe(user, mediaType);

            setUsers((prev) => {
                const exists = prev.find((u) => u.uid === user.uid);
                if (exists) return prev.map((u) => (u.uid === user.uid ? user : u));
                return [...prev, user];
            });

            if (mediaType === "video") {
                // ✅ Track available → trigger render
                console.log("User published video:", user.uid);
            }

            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        });

     client.current.on("user-unpublished", (user, mediaType) => {
        console.log(`User unpublished: ${user.uid}`, mediaType);
        if (mediaType === "video" || mediaType === "audio") {
            setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
        });

      client.current.on("user-left", (user) => {
  console.log("User left:", user.uid);
  setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
});

      setJoined(true);
    };

    init();

    return () => {
      localTracks.current.audioTrack?.stop();
      localTracks.current.audioTrack?.close();
      localTracks.current.videoTrack?.stop();
      localTracks.current.videoTrack?.close();
      client.current?.leave();
    };
  }, []);

  return (
    <AgoraContext.Provider value={{ client, localTracks, users, joined }}>
      {children}
    </AgoraContext.Provider>
  );
};
