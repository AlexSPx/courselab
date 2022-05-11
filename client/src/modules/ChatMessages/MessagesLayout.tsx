import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "../../contexts/UserContext";
import { ChatRoom } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import SideBar from "../Layouts/SideBar";
import ChatPreview from "./ChatPreview";
import Searchbar from "./Searchbar";

export const MessagesLayout: React.FC = ({ children }) => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const { userData } = useContext(UserContext);
  useSWR(`${baseurl}/chatroom/rooms`, {
    onSuccess: (data) => setChatrooms(data),
  });
  const { t } = useTranslation();
  const mapRooms = chatrooms.map((chatroom) => {
    return (
      <ChatPreview
        key={chatroom.id}
        chatroom={chatroom}
        emailLabel={t("email")}
        userId={userData?.user?.id!}
      />
    );
  });

  return (
    <div
      className="flex flex-row w-full h-full overflow-auto bg-gray-50"
      id="journal-scroll"
    >
      <SideBar css="bg-white pt-12 w-[32vw] z-10 relative">
        <Searchbar
          email={t("email")}
          searching={t("searching")}
          instructions={t("chat-instructions")}
        />
        {mapRooms}
      </SideBar>
      <div
        className="flex flex-row w-full h-full items-center overflow-auto"
        id="journal-scroll"
      >
        {children}
      </div>
    </div>
  );
};
