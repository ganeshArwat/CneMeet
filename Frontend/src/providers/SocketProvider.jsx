import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
const backendUrl = import.meta.env.VITE_SOCKET_SERVER;

export const SocketProvider = ({ children }) => {
  const serverUrl = "http://localhost:5000"
  const socket = useMemo(() => io(backendUrl || serverUrl), []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};


