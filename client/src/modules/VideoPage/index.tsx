import axios from "axios";
import { NextPage } from "next";
import useSWR from "swr";
import { VideoInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type VideoPageProps = {
  video: VideoInterface;
};

export const Video: NextPage<VideoPageProps> = ({ video }) => {
  const { data, mutate } = useSWR(`${baseurl}/video/${video?.id}`, fetcher, {
    fallback: video || {},
  });

  return (
    <WithAuth>
      <AuthHeader />
      <MainLayout css="overflow-auto">
        <Page video={data || video} mutate={mutate} />
      </MainLayout>
    </WithAuth>
  );
};

Video.getInitialProps = async ({ query, req }) => {
  const videoId = typeof query.id === "string" ? query.id : "";

  try {
    const res = await axios.get(`${baseurl}/video/${videoId}`, {
      withCredentials: true,
      headers: {
        cookie: req?.headers.cookie,
      },
    });
    console.log(res.data);

    return { video: res.data };
  } catch (error) {
    return { video: null };
  }
};
