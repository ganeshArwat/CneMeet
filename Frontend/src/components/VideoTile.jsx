import React, { useEffect, useRef } from "react";
import { useAgora } from "../context/AgoraContext";

const VideoTile = ({ user }) => {
  const videoRef = useRef(null);
  const { userMap } = useAgora();

  useEffect(() => {
    if (videoRef.current && user.videoTrack) {
      try {
        const maybePromise = user.videoTrack.play(videoRef.current);

        if (maybePromise instanceof Promise) {
          maybePromise.catch((err) =>
            console.error("Error playing video track:", err)
          );
        }
      } catch (err) {
        console.error("Exception while trying to play video:", err);
      }
    }
  }, [user.videoTrack]);

  const name =
    user.uid === "local" ? "You" : userMap[user.uid] || `User ${user.uid}`;

  return (
    <div className="relative aspect-video bg-black rounded overflow-hidden border border-gray-600">
      <div ref={videoRef} className="w-full h-full" />
      <div className="absolute bottom-1 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {name}
      </div>
    </div>
  );
};

export default VideoTile;
