import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import CourseDraftCard from "../../components/cards/CourseDraftCard";
import FormatDate from "../../components/FormatDate";
import SeoTags from "../../components/SeoTags";
import { DocumentUser, VideoUser } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { DocumentIcon, VideoIcon } from "../../svg/small";
import { MainLayout, Main } from "../Layouts/MainLayout";

type DocumentName = {
  document: {
    id: string;
    name: string;
  };
};

type VideoName = {
  video: {
    id: string;
    name: string;
  };
};

type FilesPageType = {
  files: {
    documents: (DocumentUser & DocumentName)[];
    videos: (VideoUser & VideoName)[];
  };
};

export const MyFilesPage: NextPage<FilesPageType> = ({
  files: { documents, videos },
}) => {
  const mapDocument = documents.map((documentOnUser) => {
    return (
      <Document
        documentOnUser={documentOnUser}
        key={documentOnUser.AssignedAt?.toString() || new Date().toString()}
      />
    );
  });
  const mapVideos = videos.map((videoOnUser) => {
    return (
      <Video
        videoOnUser={videoOnUser}
        key={videoOnUser.AssignedAt?.toString() || new Date().toString()}
      />
    );
  });

  return (
    <MainLayout>
      <SeoTags
        title="CourseLab | Manager"
        description="The place to manage your courses"
      />
      <Main css="max-w-4xl">
        <div className="divider">Documents</div>
        {mapDocument}
        <div className="divider">Videos</div>
        {mapVideos}
      </Main>
    </MainLayout>
  );
};

const Document = ({
  documentOnUser,
}: {
  documentOnUser: DocumentUser & DocumentName;
}) => {
  return (
    <Link href={`/doc/${documentOnUser.document.id}`} passHref={true}>
      <a
        className="flex w-full border border-gray-800 rounded p-1 px-6 my-1 hover:bg-gray-200 cursor-pointer"
        target="_blank"
      >
        <div className="flex flex-row items-center justify-center mr-3">
          <DocumentIcon />
          Document
        </div>
        <div className="divider divider-vertical"></div>
        {documentOnUser.document.name}
      </a>
    </Link>
  );
};

const Video = ({ videoOnUser }: { videoOnUser: VideoUser & VideoName }) => {
  return (
    <Link href={`/doc/${videoOnUser.video.id}`} passHref={true}>
      <a
        className="flex w-full border border-gray-800 rounded p-1 px-6 my-1 hover:bg-gray-200 cursor-pointer"
        target="_blank"
      >
        <div className="flex flex-row items-center justify-center mr-3">
          <VideoIcon />
          Video
        </div>
        <div className="divider divider-vertical"></div>
        {videoOnUser.video.name}
      </a>
    </Link>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    try {
      const { data } = await axios.get(`${baseurl}/user/myfiles`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          files: data,
          user: req.user,
        },
      };
    } catch (error) {
      return {
        props: {
          files: null,
          user: undefined,
        },
      };
    }
  }
);
