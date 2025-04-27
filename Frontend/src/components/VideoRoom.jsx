import { Children } from "react";
import Video from "./Video";
import VideoControls from "./VideoControls";

function VideoRoom({ myStream, localUserName, remoteStream, remoteUserName }) {
  return <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
    <div className="flex flex-col sm:flex-row gap-4">
      <Video stream={myStream} UserName={localUserName} />
      <Video stream={remoteStream} UserName={remoteUserName} isMuted={false} />
    </div>
    <VideoControls />
  </div>;
}

export default VideoRoom;
