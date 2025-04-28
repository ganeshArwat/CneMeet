import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { SocketProvider } from "./providers/SocketProvider";
import { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </SocketProvider>

      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
