import { useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { WebSocketContext } from "../contexts/SocketContext";

export default function useWebSocketSubscribe(
  eventName: string,
  eventHnadler: () => void
) {
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    socket?.on(eventName, eventHnadler);

    return () => {
      socket?.off(eventName, eventHnadler);
    };
  }, [eventHnadler, eventName, socket]);
}
