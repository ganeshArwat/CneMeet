import { useEffect, useState, useRef } from "react";

function Video({ stream, UserName, isMuted = true }) {
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
    <div className="bg-black rounded-xl overflow-hidden w-full sm:w-[48%] shadow-lg">
      <div className="w-full h-auto aspect-[16/9]">
        <video
          autoPlay
          muted={isMuted}
          className="w-full h-full object-cover rounded- "
          ref={videoRef}
        />
      </div>
      <div className="bg-gray-800 p-2 text-center text-white rounded-b-xl h-full">
        <h1 className="text-lg font-semibold">{UserName}</h1>
      </div>
    </div>
  );
}

export default Video;
