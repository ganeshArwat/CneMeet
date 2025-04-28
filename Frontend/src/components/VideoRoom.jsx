import { Children } from "react";
import Video from "./Video";
import VideoControls from "./VideoControls";

function VideoRoom({ myStream, localUserName, remoteStream, remoteUserName, toggleVideo, videoOn, toggleAudio, audioOn, disconnectCall, toggleScreenShare, isScreenSharing, screenStream }) {
  return <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
    <div className="flex flex-col sm:flex-row gap-4">
      <Video stream={isScreenSharing ? screenStream : myStream} UserName={localUserName} />
      <Video stream={remoteStream} UserName={remoteUserName} isMuted={false} />
    </div>
    <VideoControls toggleVideo={toggleVideo} videoOn={videoOn} toggleAudio={toggleAudio} audioOn={audioOn} disconnectCall={disconnectCall} toggleScreenShare={toggleScreenShare} isScreenSharing={isScreenSharing}/>
  </div>;
}

export default VideoRoom;
