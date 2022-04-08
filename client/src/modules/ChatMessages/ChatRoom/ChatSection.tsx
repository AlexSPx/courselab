import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../contexts/SocketContext";
import { UserContext } from "../../../contexts/UserContext";
import useMessageQuery from "../../../Hooks/useMessageQuery";
import { ChatRoom } from "../../../interfaces";
import Message from "./Message";

export default function ChatSection({
  chatroom,
  typeLabel,
  typingLabel,
}: {
  chatroom: ChatRoom;
  typeLabel: string;
  typingLabel: string;
}) {
  const { socket } = useContext(WebSocketContext);
  const { userData } = useContext(UserContext);

  const [messageToSend, setMessageToSend] = useState<string>("");
  const [senderId, setSenderId] = useState(
    chatroom.members.find(
      (member) => member.user.username === userData?.user?.username
    )?.id
  );
  const [loadCount, setLoadCount] = useState(0);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const { messages, setRefFirstMessage, setRefLastMessage, scroll } =
    useMessageQuery(chatroom, loadCount, setLoadCount);

  useEffect(() => {
    if (!socket) return;
    socket.emit("chatroom-join", { chatroomId: chatroom.id });

    const handleStartTyping = (username: string) =>
      setUsersTyping((old) => [...old, username]);
    socket.on("start-typing", handleStartTyping);

    const handleStopTyping = (username: string) =>
      setUsersTyping((old) => old.filter((uname) => uname !== username));
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("start-typing", handleStartTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [chatroom.id, socket]);

  useEffect(() => {
    if (!socket) return;
    const userInformation = {
      chatroomId: chatroom.id,
      username: userData?.user?.username,
    };
    if (messageToSend.length > 0) socket.emit("start-typing", userInformation);
    else socket.emit("stop-typing", userInformation);
  }, [chatroom.id, messageToSend, socket, userData?.user?.username]);

  const emmitMessage = async () => {
    if (!socket) return;
    event?.preventDefault();
    if (messageToSend) {
      socket.emit("message-send", {
        chatroomId: chatroom.id,
        text: messageToSend,
        senderId: senderId,
      });
      setMessageToSend("");
    }
  };

  const mapUsersTyping = usersTyping.map(
    (user, index) => user + (index !== usersTyping.length - 1 ? "," : "")
  );

  const mapMessages = messages.map((message, index) => {
    const lastMessageCalc = scroll
      ? messages.length - 1
      : messages.length - (loadCount - 1) * 20;

    return (
      <Message
        key={message.id + Date.now()}
        message={message}
        senderId={senderId!}
        member={
          chatroom.members.find((member) => member.id === message.sender_id)!
        }
        lastMessageCalc={lastMessageCalc}
        index={index}
        setRefFirstMessage={setRefFirstMessage}
        setRefLastMessage={setRefLastMessage}
      />
    );
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-full max-h-[67rem] overflow-auto" id="journal-scroll">
        {mapMessages}
      </div>
      <section className="flex flex-col order-last w-full h-24 justify-center p-2">
        <p className="text-sm text-gray-500 h-7 italic mx-3">
          {usersTyping.length > 0 && (
            <>
              {mapUsersTyping} {typingLabel}...
            </>
          )}
        </p>
        <div className="flex flex-row h-full w-[95%] bg-white border-2 rounded-lg justify-center">
          <input
            type="text"
            className="w-[87%] outline-none"
            placeholder={typeLabel}
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") emmitMessage();
            }}
          />
        </div>
      </section>
    </div>
  );
}
