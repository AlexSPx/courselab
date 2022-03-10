import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import SeoTags from "../../components/SeoTags";
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
      <SeoTags
        title={`CourseLab | ${enrollment.course?.public_name || "Error"}`}
        description={`Your main hub for the ${
          enrollment.course?.public_name || "Error"
        } course`}
      />
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
