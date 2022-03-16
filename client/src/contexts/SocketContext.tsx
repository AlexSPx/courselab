import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { UserDataInterface } from "../interfaces";
import { absurl } from "../lib/fetcher";

type WebSocketContextProps = {
  socket: Socket | null;
};

type WebSocketProviderProps = {
  user: UserDataInterface | null;
};

export const WebSocketContext = React.createContext<WebSocketContextProps>({
  socket: null,
});

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  user,
}) => {
  const [socket, setSocket] = useState(
    io(absurl, {
      withCredentials: true,
      autoConnect: false,
    })
  );

  useEffect(() => {
    if (user?.isAuth && !socket.connected) {
      socket.connect();
    }
  }, [socket, user]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
