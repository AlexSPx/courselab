import { NextPage, GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import SeoTags from "../../components/SeoTags";
import { WebSocketContext } from "../../contexts/SocketContext";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { Main, MainLayout } from "../Layouts/MainLayout";

export const ControlPanelPage: NextPage = () => {
  const { socket } = useContext(WebSocketContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = ({ users }: any) => {
      setUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [socket]);
  useSWR(`${baseurl}/user/online`, { onSuccess: (data) => setUsers(data) });

  return (
    <MainLayout>
      <SeoTags
        title={`Control Panel`}
        description={`The general settings for your course`}
      />
      <Main>
        <h1 className="text-2xl text-center">Comming Soon</h1>
      </Main>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const course = typeof query.name === "string" ? query.name : "";

    return {
      props: {
        user: req.user,
      },
    };
  },
  { requiresAdmin: true }
);
