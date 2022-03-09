import axios from "axios";
import { GetServerSideProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { CourseGeneralRawInterface } from "..";
import { CourseDetails } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import Page from "./Page";

export type CoursePublicRaw = CourseGeneralRawInterface & {
  ExtendedDetails: CourseDetails;
};

export const CoursePage: NextPage<{ course: CoursePublicRaw }> = ({
  course,
}) => {
  return (
    <>
      <Head>
        <title>CourseLab | {course.public_name}</title>
        <meta
          name="description"
          content={`Course page for ${course.public_name} | ${course.name}`}
        />
        <meta name="og:title" content={`CourseLab | ${course.public_name}`} />
      </Head>
      <Page courseRaw={course} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req }) => {
    const course = typeof query.name === "string" ? query.name : "";
    try {
      const { data } = await axios.get(`${baseurl}/course/${course}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          course: data,
          user: req.user || null,
        },
      };
    } catch (error) {
      return {
        props: {
          course,
          user: undefined || null,
        },
      };
    }
  },
  { requiresAuth: false }
);
