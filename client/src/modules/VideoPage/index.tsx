import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";
import SeoTags from "../../components/SeoTags";
import { VideoInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
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
    <MainLayout css="overflow-auto">
      <SeoTags
        title={`CourseLab | Video player - ${video.name || "Error"}`}
        description="Video player page"
      />
      <Page video={data || video} mutate={mutate} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req, locale }) => {
    const videoId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(`${baseurl}/video/${videoId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          video: res.data,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          video: null,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    }
  }
);
