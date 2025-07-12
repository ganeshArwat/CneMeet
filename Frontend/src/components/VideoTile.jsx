import React, { useEffect, useRef } from "react";
import { useAgora } from "../context/AgoraContext";

const VideoTile = ({ user }) => {
  console.log("Users: ",user);
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
    } else if (videoRef.current) {
      // Clear any previously attached video element
      videoRef.current.innerHTML = "";
    }
  }, [user.videoTrack]);

  const name =
    user.uid === "local" ? "You" : userMap[user.uid] || `User ${user.uid}`;
  const isVideoMuted = !user.videoTrack;
  const isAudioMuted = !user.audioTrack;

  return (
    <div className="relative aspect-video bg-black rounded overflow-hidden border border-gray-600 flex items-center justify-center">
      {/* Video layer */}
      <div ref={videoRef} className="w-full h-full absolute inset-0" />

      {/* If video is muted, show placeholder */}
      {isVideoMuted && (
        <div className="z-10 flex flex-col items-center justify-center text-white text-sm bg-gray-800/70 p-4 rounded">
          <div className="text-3xl mb-2">📷</div>
          <div>{name}</div>
         
        </div>
      )}

      {/* Name tag always shown */}
      <div className="absolute bottom-1 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded z-10">
        {name}  {isAudioMuted && <span className="text-xs mt-1 text-red-400">🔇</span>}
      </div>
    </div>
  );
};

export default VideoTile;
