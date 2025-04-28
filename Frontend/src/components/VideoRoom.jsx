import { Children } from "react";
import Video from "./Video";
import VideoControls from "./VideoControls";

function VideoRoom({ myStream, localUserName, remoteStream, remoteUserName, toggleVideo, videoOn, toggleAudio, audioOn, disconnectCall, toggleScreenShare, isScreenSharing, screenStream, isPinned, togglePin }) {
  return <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full">
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-grow">
      {!isPinned && <Video stream={isScreenSharing ? screenStream : myStream} UserName={"you"} isMuted={false} togglePin={togglePin} />}
      <Video stream={remoteStream} UserName={remoteUserName} isMuted={false} isPinned={isPinned} togglePin={togglePin} />
    </div>
    <VideoControls toggleVideo={toggleVideo} videoOn={videoOn} toggleAudio={toggleAudio} audioOn={audioOn} disconnectCall={disconnectCall} toggleScreenShare={toggleScreenShare} isScreenSharing={isScreenSharing} />
  </div>;
}

export default VideoRoom;
