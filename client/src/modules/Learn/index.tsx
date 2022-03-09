import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { Enrollment } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { LearnLayout } from "./LearnLayout";
import Page from "./Page";

type EnrollmentType = {
  enrollment: Enrollment;
};

export const LearnHome: NextPage<EnrollmentType> = ({ enrollment }) => {
  return (
    <LearnLayout
      weeks={enrollment.course!.weeks!}
      name={enrollment.course!.name}
      public_name={enrollment.course!.public_name}
    >
      <Head>
        <title>CourseLab | {enrollment.course?.public_name || "Error"}</title>
        <meta
          name="description"
          content={`Your main hub for the ${
            enrollment.course?.public_name || "Error"
          } course`}
        />
        <meta
          name="og:title"
          content={`CourseLab | ${enrollment.course?.public_name || "Error"}`}
        />
      </Head>
      <Page enrollment={enrollment} />
    </LearnLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const course = typeof query.name === "string" ? query.name : "";
    try {
      const courseRes = await axios.get(
        `${baseurl}/course/mycourse/${course}`,
        {
          withCredentials: true,
          headers: {
            cookie: req?.headers.cookie,
          },
        }
      );

      return {
        props: {
          user: req.user,
          enrollment: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: req.user,
          enrollment: course,
        },
      };
    }
  }
);
