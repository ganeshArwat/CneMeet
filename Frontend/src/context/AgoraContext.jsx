// src/context/AgoraContext.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { appId, token } from "../agora/AgoraConfig";
import { db } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";

const AgoraContext = createContext();
export const useAgora = () => useContext(AgoraContext);

export const AgoraProvider = ({ children, userName, roomId }) => {
  const client = useRef(null);
  const localTracks = useRef({ audioTrack: null, videoTrack: null });
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [uid, setUid] = useState(null);
  const [userMap, setUserMap] = useState({}); // uid -> name

  useEffect(() => {
    if (!roomId || !userName) return;

    const init = async () => {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const newUid = await client.current.join(appId, roomId, token || null, null);
      setUid(newUid);

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks.current = { audioTrack: mic, videoTrack: cam };
      await client.current.publish([mic, cam]);

      // 🔁 Save my name to Firebase (per room)
      await set(ref(db, `rooms/${roomId}/users/${newUid}`), userName);

      setUsers([
        {
          uid: newUid,
          name: userName,
          videoTrack: cam,
          audioTrack: mic,
        },
      ]);

      // 🔁 Listen for names (per room)
      onValue(ref(db, `rooms/${roomId}/users`), (snapshot) => {
        const data = snapshot.val() || {};
        setUserMap(data); // { uid: name }
      });

      // 🔁 Existing remote users
      client.current.remoteUsers.forEach(async (user) => {
        if (user.hasVideo) await client.current.subscribe(user, "video");
        if (user.hasAudio) await client.current.subscribe(user, "audio");

        setUsers((prev) => {
          if (prev.find((u) => u.uid === user.uid)) return prev;
          return [...prev, user];
        });

        user.audioTrack?.play();
      });

      // 🔁 New users
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

      // Clean up on tab close
      const handleTabClose = () => {
        if (newUid) {
          remove(ref(db, `rooms/${roomId}/users/${newUid}`));
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
        remove(ref(db, `rooms/${roomId}/users/${uid}`));
      }

      client.current?.leave();
    };
  }, [roomId, userName]);

  return (
    <AgoraContext.Provider value={{ client, localTracks, users, userMap, joined }}>
      {children}
    </AgoraContext.Provider>
  );
};
