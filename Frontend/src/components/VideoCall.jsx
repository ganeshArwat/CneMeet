import React from "react";
import { useAgora } from "../context/AgoraContext";
import VideoTile from "./VideoTile";
// import Controls from "./Controls";
// import ChatBox from "./ChatBox";

const VideoCall = () => {
  const { users, joined } = useAgora();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-white">Cne Meet</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users
          .filter((u) => u.videoTrack || u.uid === "local")
          .map((user) => (
            <VideoTile
              key={user.uid}
              user={user}
              isLocal={user.uid === "local"}
              name={user.name}
            />
          ))}
      </div>

      {/* <Controls /> */}

      {/* <div className="mt-6">
        <ChatBox />
      </div> */}
    </div>
  );
};

export default VideoCall;
