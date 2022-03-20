import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import useSWR from "swr";
import SeoTags from "../../../components/SeoTags";
import { GeneralUserInformation } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import { MessagesLayout } from "../MessagesLayout";
import ChatSection from "./ChatSection";
import DirectMessageSettings from "./DirectMessageSettings";
import NoChatRoom from "./NoChatRoom";

type ChatMessageProps = {
  chat: null;
  receiver?: GeneralUserInformation;
  query: ParsedUrlQuery;
};

export const ChatMessages: NextPage<ChatMessageProps> = ({
  chat,
  receiver,
}) => {
  const { query } = useRouter();
  console.log(query.to?.toString());
  const { mutate } = useSWR(`${baseurl}/chatroom/${query.id}/${query.to}`, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess: (data) => {
      setChatroom(data.room);
      setUser(data.user);
    },
  });

  useEffect(() => {
    mutate();
    console.log("here");
  }, [mutate, query]);

  const [user, setUser] = useState<GeneralUserInformation | undefined>(
    receiver
  );
  const [chatroom, setChatroom] = useState(chat);
  console.log(chatroom);

  return (
    <MessagesLayout>
      <SeoTags
        title={`Chat Messages`}
        description={`The place to chat with your course teachers or just anyone`}
      />
      {!chatroom && user && <NoChatRoom user={user} mutate={mutate} />}
      {chatroom && <ChatSection chatroom={chatroom} />}
      {user && <DirectMessageSettings user={user} />}
    </MessagesLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const type = typeof query.id === "string" ? query.id : "";
    const to = typeof query.to === "string" ? query.to : "";

    try {
      const { data } = await axios.get(`${baseurl}/chatroom/${type}/${to}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      console.log(data);

      return {
        props: {
          user: req.user,
          chat: data.room,
          receiver: data.user,
        },
      };
    } catch (error) {
      return {
        props: {
          user: req.user,
          chat: to,
          receiver: null,
        },
      };
    }
  }
);
