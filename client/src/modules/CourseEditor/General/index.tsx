import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import SeoTags from "../../../components/SeoTags";
import { CourseInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import { CourseEditorLayout } from "../CourseEditorLayout";
import Page from "./Page";

interface CourseEditorPageProps {
  course: CourseInterface;
}

export const CourseGeneralSettings: NextPage<CourseEditorPageProps> = ({
  course,
}) => {
  return (
    <CourseEditorLayout name={course.name} published={course.published}>
      <SeoTags
        title={`CourseLab | General Settings | ${course.public_name}`}
        description={`The general settings for your course`}
      />
      <Page course={course} />
    </CourseEditorLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const course = typeof query.name === "string" ? query.name : "";

    try {
      const courseRes = await axios.get(
        `${baseurl}/course/fetchadmin/${course}`,
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
          course: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          course,
        },
      };
    }
  }
);
