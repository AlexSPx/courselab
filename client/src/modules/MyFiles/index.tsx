import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const { t } = useTranslation();

  const mapDocument = documents.map((documentOnUser) => {
    return (
      <Document
        documentOnUser={documentOnUser}
        key={documentOnUser.AssignedAt?.toString() || new Date().toString()}
        label={t("document")}
      />
    );
  });
  const mapVideos = videos.map((videoOnUser) => {
    return (
      <Video
        videoOnUser={videoOnUser}
        key={videoOnUser.AssignedAt?.toString() || new Date().toString()}
        label={t("video")}
      />
    );
  });

  return (
    <MainLayout>
      <SeoTags
        title="CourseLab | Manager"
        description="The place to manage your courses"
      />
      <Main css="max-w-4xl items-center">
        <div className="divider w-full text-lg">{t("documents")}</div>
        {mapDocument.length ? (
          mapDocument
        ) : (
          <h3 className="text-lg font-mono text-gray-500">
            {t("no-documents")}
          </h3>
        )}
        <div className="divider w-full text-lg">{t("videos")}</div>
        {mapVideos.length ? (
          mapVideos
        ) : (
          <h3 className="text-lg font-mono text-gray-500">
            {t("no-documents")}
          </h3>
        )}
      </Main>
    </MainLayout>
  );
};

const Document = ({
  documentOnUser,
  label,
}: {
  documentOnUser: DocumentUser & DocumentName;
  label: string;
}) => {
  return (
    <Link href={`/doc/${documentOnUser.document.id}`} passHref={true}>
      <a
        className="flex w-full border border-gray-800 rounded p-1 px-6 my-1 hover:bg-gray-200 cursor-pointer"
        target="_blank"
      >
        <div className="flex flex-row items-center justify-center mr-3">
          <DocumentIcon />
          {label}
        </div>
        <div className="divider divider-vertical"></div>
        {documentOnUser.document.name}
      </a>
    </Link>
  );
};

const Video = ({
  videoOnUser,
  label,
}: {
  videoOnUser: VideoUser & VideoName;
  label: string;
}) => {
  return (
    <Link href={`/video/${videoOnUser.video.id}`} passHref={true}>
      <a
        className="flex w-full border border-gray-800 rounded p-1 px-6 my-1 hover:bg-gray-200 cursor-pointer"
        target="_blank"
      >
        <div className="flex flex-row items-center justify-center mr-3">
          <VideoIcon />
          {label}
        </div>
        <div className="divider divider-vertical"></div>
        {videoOnUser.video.name}
      </a>
    </Link>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
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

          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    } catch (error) {
      return {
        props: {
          files: null,
          user: undefined,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    }
  }
);
