import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import { UserDataInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type Courses = {
  courses: MyCourseInterface[];
  user: UserDataInterface;
};

export interface MyCourseInterface {
  id: string;
  course: {
    name: string;
    public_name: string;
  };
}

export const Home: NextPage<Courses> = ({ courses, user }) => {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <SeoTags
        title={`CourseLab | Home Page | @${user.user?.username}`}
        description={`CourseLab home page for ${user.user?.username}`}
      />
      <Page courses={courses} t={t} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    try {
      const courses = await axios.get(`${baseurl}/course/mycourses`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          courses: courses.data,
          user: req.user,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    } catch (error) {
      return {
        props: {
          courses: null,
          user: undefined,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    }
  }
);
