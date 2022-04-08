import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";
import SeoTags from "../../components/SeoTags";
import { CourseInterface, UserDataInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

interface CreateCoursePageProps {
  drafts: CourseInterface[];
  user: UserDataInterface;
}

export const CreateCoursePage: NextPage<CreateCoursePageProps> = ({
  drafts,
  user,
}) => {
  const { data } = useSWR(`${baseurl}/course/mydrafts`, fetcher, {
    fallbackData: drafts,
  });
  const { t } = useTranslation();
  return (
    <MainLayout>
      <SeoTags
        title={`CourseLab | Create Course & Drafts | ${user.user?.username}`}
        description={`Create course page & drafts for ${user.user?.username}`}
      />
      <Page drafts={data || drafts} t={t} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    try {
      const drafts = await axios.get(`${baseurl}/course/mydrafts`, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          drafts: drafts.data,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          drafts: null,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    }
  }
);
