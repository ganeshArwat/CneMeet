// src/context/AgoraContext.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { appId, token, channelName } from "../agora/AgoraConfig";
import { db } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";

const AgoraContext = createContext();
export const useAgora = () => useContext(AgoraContext);

export const AgoraProvider = ({ children, userName }) => {
  const client = useRef(null);
  const localTracks = useRef({ audioTrack: null, videoTrack: null });
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [uid, setUid] = useState(null);
  const [userMap, setUserMap] = useState({}); // uid -> name

  useEffect(() => {
    const init = async () => {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const newUid = await client.current.join(appId, channelName, token || null, null);
      setUid(newUid);

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks.current = { audioTrack: mic, videoTrack: cam };
      await client.current.publish([mic, cam]);

      // 🔁 Save my name to Firebase
      await set(ref(db, `rooms/${channelName}/users/${newUid}`), userName);

      setUsers([
        {
          uid: newUid,
          name: userName,
          videoTrack: cam,
          audioTrack: mic,
        },
      ]);

      // 🔁 Listen for names
      onValue(ref(db, `rooms/${channelName}/users`), (snapshot) => {
        const data = snapshot.val() || {};
        setUserMap(data); // { uid: name }
      });

      // 🔁 Subscribe to existing users
      client.current.remoteUsers.forEach(async (user) => {
        if (user.hasVideo) await client.current.subscribe(user, "video");
        if (user.hasAudio) await client.current.subscribe(user, "audio");

        setUsers((prev) => {
          if (prev.find((u) => u.uid === user.uid)) return prev;
          return [...prev, user];
        });

        user.audioTrack?.play();
      });

      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        setUsers((prev) => {
          const exists = prev.find((u) => u.uid === user.uid);
          if (exists) return prev;
          return [...prev, user];
        });

        if (mediaType === "audio") user.audioTrack?.play();
      });

      client.current.on("user-unpublished", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      client.current.on("user-left", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

        // Remove on tab close
      const handleTabClose = () => {
        if (uid) {
          remove(ref(db, `rooms/${channelName}/users/${uid}`));
        }
      };

      window.addEventListener("beforeunload", handleTabClose);

      setJoined(true);
    };

    init();

    return () => {
      localTracks.current.audioTrack?.stop();
      localTracks.current.audioTrack?.close();
      localTracks.current.videoTrack?.stop();
      localTracks.current.videoTrack?.close();

      if (uid) {
        remove(ref(db, `rooms/${channelName}/users/${uid}`));
      }

      client.current?.leave();
    };
  }, []);

  return (
    <AgoraContext.Provider value={{ client, localTracks, users, userMap, joined }}>
      {children}
    </AgoraContext.Provider>
  );
};
