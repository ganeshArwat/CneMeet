import React, { useState } from "react";
import { AgoraProvider } from "./context/AgoraContext";
import VideoCall from "./components/VideoCall";

function App() {
  const [name, setName] = useState("Ganesh"); // Later, ask this in a lobby

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AgoraProvider userName={name}>
        <VideoCall />
      </AgoraProvider>
    </div>
  );
}

export default App;
