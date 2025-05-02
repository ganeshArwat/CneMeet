import { useEffect, useState, useRef } from "react";
import { TbPin, TbPinnedOff } from "react-icons/tb";

function Video({ stream, UserName, isMuted = true, isPinned = false, togglePin }) {
  const [myStream, setMyStream] = useState(null);

  // Using useRef to directly reference the video element
  const videoRef = useRef(null);

  useEffect(() => {
    // If stream is not passed via props, getUserMedia is called
    setMyStream(stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream; // Set the passed stream to the video element
    }
  }, [stream]); // Only run the effect when 'stream' changes

  return (
    <div className={`bg-black rounded-xl overflow-hidden shadow-lg ${isPinned
      ? "w-full md:w-2/3 " // Fullscreen pinned
      : "w-full sm:w-[48%]" // Normal small size
      }`}>
      <div className="w-full h-auto aspect-[16/9]">
        <video
          autoPlay
          muted={isMuted}
          className="w-full h-full object-cover rounded- "
          ref={videoRef}
        />
      </div>
      <div className="bg-gray-800 p-2 text-center text-white rounded-b-xl h-full">
        <h1 className="text-lg font-semibold">{UserName ? UserName : "____"} {UserName && UserName != "you" ? <button onClick={togglePin}>{isPinned ? <TbPinnedOff /> : <TbPin />}</button> : ""} </h1>
      </div>
    </div>
  );
}

export default Video;
