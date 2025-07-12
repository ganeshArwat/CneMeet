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
import { ref, set, remove, onValue, get } from "firebase/database";

const AgoraContext = createContext();
export const useAgora = () => useContext(AgoraContext);

export const AgoraProvider = ({ children, userName, roomId }) => {
  const client = useRef(null);
  const localTracks = useRef({ audioTrack: null, videoTrack: null });
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [uid, setUid] = useState(null);
  const [userMap, setUserMap] = useState({}); // uid -> name

  const leaveRoom = async () => {
    if (uid && roomId) {
      const userRef = ref(db, `rooms/${roomId}/users/${uid}`);
      await remove(userRef);

      // 🔥 If last user, remove chatMessages
      const usersRef = ref(db, `rooms/${roomId}/users`);
      const snapshot = await get(usersRef);
      if (!snapshot.exists() || Object.keys(snapshot.val() || {}).length === 0) {
        await remove(ref(db, `rooms/${roomId}/chatMessages`));
      }
    }

    localTracks.current.audioTrack?.stop();
    localTracks.current.audioTrack?.close();
    localTracks.current.videoTrack?.stop();
    localTracks.current.videoTrack?.close();

    await client.current?.leave();
  };

  useEffect(() => {
    if (!roomId || !userName) return;

    const init = async () => {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      const newUid = await client.current.join(appId, roomId, token || null, null);
      setUid(newUid);

      const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks.current = { audioTrack: mic, videoTrack: cam };
      await client.current.publish([mic, cam]);

      await set(ref(db, `rooms/${roomId}/users/${newUid}`), userName);

      setUsers([
        {
          uid: newUid,
          name: userName,
          videoTrack: cam,
          audioTrack: mic,
        },
      ]);

      onValue(ref(db, `rooms/${roomId}/users`), (snapshot) => {
        const data = snapshot.val() || {};
        setUserMap(data);
      });

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

        setUsers((prevUsers) => {
          const existing = prevUsers.find((u) => u.uid === user.uid);
          if (existing) {
            return prevUsers.map((u) =>
              u.uid === user.uid
                ? {
                    ...u,
                    videoTrack: mediaType === "video" ? user.videoTrack : u.videoTrack,
                    audioTrack: mediaType === "audio" ? user.audioTrack : u.audioTrack,
                  }
                : u
            );
          } else {
            return [...prevUsers, user];
          }
        });

        if (mediaType === "audio") user.audioTrack?.play();
      });

      client.current.on("user-unpublished", (user, mediaType) => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === user.uid
              ? {
                  ...u,
                  videoTrack: mediaType === "video" ? null : u.videoTrack,
                  audioTrack: mediaType === "audio" ? null : u.audioTrack,
                }
              : u
          )
        );
      });

      client.current.on("user-left", (user) => {
        setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      // ✅ Clean up on tab close or refresh
      const handleTabClose = async () => {
        if (newUid && roomId) {
          await remove(ref(db, `rooms/${roomId}/users/${newUid}`));

          const usersRef = ref(db, `rooms/${roomId}/users`);
          const snapshot = await get(usersRef);
          if (!snapshot.exists() || Object.keys(snapshot.val() || {}).length === 0) {
            await remove(ref(db, `rooms/${roomId}/chatMessages`));
          }
        }
      };

      window.addEventListener("beforeunload", handleTabClose);

      // Optional: remove listener on unmount
      return () => {
        window.removeEventListener("beforeunload", handleTabClose);
      };

      setJoined(true);
    };

    init();

    // ❌ Removed duplicated leave logic here
    return () => {
      localTracks.current.audioTrack?.stop();
      localTracks.current.audioTrack?.close();
      localTracks.current.videoTrack?.stop();
      localTracks.current.videoTrack?.close();

      client.current?.leave();
    };
  }, [roomId, userName]);

  return (
    <AgoraContext.Provider value={{ client, localTracks, users, userMap, joined, leaveRoom }}>
      {children}
    </AgoraContext.Provider>
  );
};
