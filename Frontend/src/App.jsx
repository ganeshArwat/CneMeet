import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import VideoRoom from "./pages/VideoRoom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<VideoRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
