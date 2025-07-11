// src/components/VideoCall.jsx
import React from "react";
import { useAgora } from "../context/AgoraContext";
import VideoTile from "./VideoTile";

const VideoCall = () => {
  const { users } = useAgora();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((user) => (
        <VideoTile key={user.uid} user={user} />
      ))}
    </div>
  );
};

export default VideoCall;
