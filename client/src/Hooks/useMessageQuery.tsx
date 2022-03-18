import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../contexts/SocketContext";
import { ChatRoom, ChatRoomMessage } from "../interfaces";
import { baseurl } from "../lib/fetcher";

export default function useMessageQuery(
  chatroom: ChatRoom,
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>
) {
  const [messages, setMessages] = useState<ChatRoomMessage[]>(
    chatroom.messages
  );
  const [cursor, setCursor] = useState<number | null>(chatroom.messagesCursor);
  const [loading, setLoading] = useState(true);
  const [scroll, setScroll] = useState<boolean>(true);

  const { socket } = useContext(WebSocketContext);
  const observer = useRef<IntersectionObserver>();

  const fetchMessages = useCallback(async () => {
    if (!cursor) return;
    const { data } = await axios.get(
      `${baseurl}/chatroom/messages/${chatroom.id}/${cursor}`,
      { withCredentials: true }
    );
    setMessages((prevMessages) => {
      return [...data.messages, ...prevMessages];
    });
    setCursor(data.cursor);
  }, [chatroom.id, cursor]);

  const setRefFirstMessage = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) fetchMessages();
      });
      if (node) observer.current.observe(node);
    },
    [fetchMessages]
  );
  const setRefLastMessage = useCallback((node) => {
    if (node) node.scrollIntoView({ smooth: true });
  }, []);

  useEffect(() => {
    setMessages(chatroom.messages);
    setCursor(chatroom.messagesCursor);
  }, [chatroom]);

  useEffect(() => {
    if (!socket) return;
    const updateMessage = (message: ChatRoomMessage) => {
      setScroll(true);
      setMessages((old) => [...old, message]);
      setCount((count) => count++);
    };
    socket.on("chatroom-message", (message) => updateMessage(message));

    return () => {
      socket.off("chatroom-message", updateMessage);
    };
  }, [setCount, socket]);

  return { messages, scroll, setRefFirstMessage, setRefLastMessage };
}
