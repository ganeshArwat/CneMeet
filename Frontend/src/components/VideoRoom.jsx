import { Children } from "react";
import ReactPlayer from "react-player";

function VideoRoom({ children }) {
  return <div className="min-h-screen bg-gray-900 text-white">{children}</div>;
}

export default VideoRoom;
