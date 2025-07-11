import React, { useEffect, useRef } from "react";

const VideoTile = ({ user, isLocal, name }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && user.videoTrack) {
        try {
          user.videoTrack.stop();
          await user.videoTrack.play(videoRef.current);
        } catch (err) {
          console.error("Error playing video track:", err);
        }
      }
    };

    playVideo();
  }, [user.videoTrack]); // 🧠 This must re-run if videoTrack changes

  return (
    <div className="relative aspect-video bg-black rounded overflow-hidden border border-gray-600">
      <div ref={videoRef} className="w-full h-full" />
      <div className="absolute bottom-1 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
        {isLocal ? "You" : name || `User ${user.uid}`}
      </div>
    </div>
  );
};

export default VideoTile;
