import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { absurl } from "../lib/fetcher";

type WebSocketContextProps = {
  socket: Socket | null;
};

export const WebSocketContext = React.createContext<WebSocketContextProps>({
  socket: null,
});

const WebSocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState(
    io(absurl, {
      withCredentials: true,
      autoConnect: true,
    })
  );

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
