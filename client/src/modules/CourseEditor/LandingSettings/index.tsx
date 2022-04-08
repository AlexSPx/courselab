import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const { t } = useTranslation("course_settings");
  return (
    <CourseEditorLayout
      name={details.courseName}
      published={details.course.published}
      t={t}
    >
      <SeoTags
        title={`CourseLab | Landing Page | ${details.course.public_name}`}
        description={`The landing page settings for your course`}
      />
      <Page details={details} t={t} />
    </CourseEditorLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query, locale }) => {
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
          ...(await serverSideTranslations(locale!, [
            "common",
            "course_settings",
          ])),
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          details: course,
          ...(await serverSideTranslations(locale!, [
            "common",
            "course_settings",
          ])),
        },
      };
    }
  }
);
