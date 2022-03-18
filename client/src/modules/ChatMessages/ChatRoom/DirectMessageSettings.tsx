import React from "react";
import Avatar from "../../../components/Avatar";
import { GeneralUserInformation } from "../../../interfaces";

export default function DirectMessageSettings({
  user,
}: {
  user: GeneralUserInformation;
}) {
  return (
    <aside className="flex flex-col h-full w-[20.5rem] py-4 px-1 items-center border-l bg-white">
      <div className="relative w-24 h-24">
        <Avatar user={user} />
      </div>
      <div className="text-lg text-center">
        <p>
          {user.first_name} {user.first_name}
        </p>
        <p className="text-gray-400">@{user.username}</p>
      </div>
    </aside>
  );
}
