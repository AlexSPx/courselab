import axios from "axios";
import React from "react";
import { KeyedMutator } from "swr";
import { GeneralUserInformation } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import useRequest from "../../../lib/useRequest";

export default function NoChatRoom({
  user,
  mutate,
}: {
  user: GeneralUserInformation;
  mutate: KeyedMutator<any>;
}) {
  const { executeQuery } = useRequest();
  const handleCreate = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/chatroom/direct`,
          { id: user.id },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Creating room",
        successTitle: "Room created",
        successBody: "Room has been created",
        onSuccess: () => mutate(),
      }
    );
  };

  return (
    <div className="flex flex-col w-[73rem] h-full items-center justify-center">
      <h3 className="text-xl">You donot have a chat room with that user</h3>
      <button
        aria-details="start chat"
        className="btn btn-primary mt-6 px-12"
        onClick={handleCreate}
      >
        Start chat
      </button>
    </div>
  );
}
