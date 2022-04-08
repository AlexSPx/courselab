import React from "react";
import Avatar from "../../../components/Avatar";
import FormatDate from "../../../components/FormatDate";
import { ChatRoomMember, ChatRoomMessage } from "../../../interfaces";

export default function Message({
  message,
  senderId,
  member,
  index,
  lastMessageCalc,
  setRefFirstMessage,
  setRefLastMessage,
}: {
  message: ChatRoomMessage;
  senderId: string;
  member: ChatRoomMember;
  index: number;
  lastMessageCalc: number;
  setRefFirstMessage: (node: any) => void;
  setRefLastMessage: (node: any) => void;
}) {
  const lastMessage = lastMessageCalc === index;
  const firstMessage = index === 0;

  if (!member) return <></>;
  return (
    <div
      className="flex flex-row items-center my-2 mx-3 p-2 bg-gray-100 rounded-lg"
      ref={
        firstMessage
          ? setRefFirstMessage
          : lastMessage
          ? setRefLastMessage
          : null
      }
    >
      <div className="relative w-12 h-12 min-w-[3rem]">
        <Avatar user={member.user || null} refresh={false} />
      </div>
      <div className="flex flex-col ml-3">
        <div className="text-gray-500 flex flex-row items-center">
          <p>
            {member.user.first_name} {member.user.last_name}
          </p>
          <p className="text-xs mx-2">{FormatDate({ date: message.sentAt })}</p>
        </div>
        <p>{message.text}</p>
      </div>
    </div>
  );
}
