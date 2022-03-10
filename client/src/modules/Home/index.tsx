import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
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
  return (
    <MainLayout>
      <SeoTags
        title={`CourseLab | Home Page | @${user.user?.username}`}
        description={`CourseLab home page for ${user.user?.username}`}
      />
      <Page courses={courses} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
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
        },
      };
    } catch (error) {
      return {
        props: {
          courses: null,
          user: undefined,
        },
      };
    }
  }
);
