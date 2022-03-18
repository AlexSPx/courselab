import { useRouter } from "next/router";
import { useState } from "react";
import Avatar from "../../components/Avatar";
import { ChatRoom } from "../../interfaces";

export default function ChatPreview({
  chatroom,
  userId,
}: {
  chatroom: ChatRoom;
  userId: string;
}) {
  const [user, setUser] = useState(
    chatroom.members.find((mmbr) => mmbr.user.id !== userId)?.user!
  );
  const [url, setUrl] = useState(
    chatroom.type.toLowerCase() +
      "?to=" +
      (chatroom.type === "DIRECT" ? user.username : chatroom.id)
  );
  const { push } = useRouter();
  return (
    <div
      className="flex w-full h-24 font-thin items-center px-2 cursor-pointer mb-1 hover:bg-gray-50"
      onClick={() =>
        push({
          pathname: "/messages/[id]",
          query: {
            id: chatroom.type.toLowerCase(),
            to: chatroom.type === "DIRECT" ? user.username : chatroom.id,
          },
        })
      }
    >
      <div className="relative h-16 w-16">
        <Avatar user={user} />
      </div>
      <div className="flex flex-col ml-3 leading-3">
        <p className="text-lg font-semithin">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-gray-400 italic">@{user.username}</p>
        <p className="text-gray-400 text-sm italic">email: {user.email}</p>
      </div>
    </div>
  );
}
