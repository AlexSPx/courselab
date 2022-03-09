import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import CourseDraftCard from "../../components/cards/CourseDraftCard";
import { CourseGeneralInterface, CourseInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { Left, Main, MainLayout, Right } from "../Layouts/MainLayout";

type CourseManagerTypes = {
  courses: CourseInterface[] | null;
};

export const Manager: NextPage<CourseManagerTypes> = ({ courses }) => {
  console.log(courses);

  const mapCourses = courses?.map((course) => {
    return <CourseDraftCard draft={course} key={course.name} />;
  });

  return (
    <MainLayout>
      <Head>
        <title>CourseLab | Manager</title>
        <meta name="description" content="The place to manage your courses" />
        <meta name="og:title" content={`CourseLab | Manager`} />
      </Head>
      <Main>
        {courses?.length ? (
          <div className="w-full flex flex-wrap">{mapCourses}</div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-2xl font-mono mt-3">There is nothing here</p>
          </div>
        )}
      </Main>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    try {
      const courseRes = await axios.get(`${baseurl}/course/mycourses/admin`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          courses: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          courses: null,
        },
      };
    }
  }
);
