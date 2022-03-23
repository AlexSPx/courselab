import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import SeoTags from "../../../components/SeoTags";
import { CourseDetails } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import { CourseEditorLayout } from "../CourseEditorLayout";
import Page from "./Page";

interface CourseEditorPageProps {
  details: CourseDetails;
}

export const CourseLandingPage: NextPage<CourseEditorPageProps> = ({
  details,
}) => {
  return (
    <CourseEditorLayout
      name={details.courseName}
      published={details.course.published}
    >
      <SeoTags
        title={`CourseLab | Landing Page | ${details.course.public_name}`}
        description={`The landing page settings for your course`}
      />
      <Page details={details} />
    </CourseEditorLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const course = typeof query.name === "string" ? query.name : "";

    try {
      const courseRes = await axios.get(`${baseurl}/course/details/${course}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          details: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          details: course,
        },
      };
    }
  }
);
