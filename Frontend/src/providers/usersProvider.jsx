import { createContext, useContext, useState } from "react";

const UsersContext = createContext(null);

export const UsersProvider = ({ children }) => {
  const [localUser, setLocalUser] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);

  return <UsersContext.Provider value={{ localUser, setLocalUser, remoteUser, setRemoteUser }}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const users = useContext(UsersContext);
  if (!users) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return users;
};
