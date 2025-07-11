import React from "react";

const Controls = ({ toggleAudio, toggleVideo, toggleScreen, isSharing }) => {
  return (
    <div className="flex gap-4 mt-4">
      <button onClick={toggleAudio} className="bg-gray-800 text-white px-4 py-2 rounded">Toggle Mic</button>
      <button onClick={toggleVideo} className="bg-gray-800 text-white px-4 py-2 rounded">Toggle Cam</button>
      <button onClick={toggleScreen} className="bg-indigo-600 text-white px-4 py-2 rounded">
        {isSharing ? "Stop Sharing" : "Share Screen"}
      </button>
    </div>
  );
};

export default Controls;
