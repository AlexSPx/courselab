import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
      <Head>
        <title>CourseLab | Home Page | @{user.user?.username}</title>
        <meta
          name="description"
          content={`CourseLab home page for ${user.user?.username}`}
        />
        <meta
          name="og:title"
          content={`CourseLab | Home Page | ${user.user?.username}`}
        />
      </Head>
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
