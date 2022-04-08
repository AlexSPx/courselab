import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../../components/SeoTags";
import { CourseInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import { CourseEditorLayout } from "../CourseEditorLayout";
import Page from "./Page";

interface CourseEditorPageProps {
  course: CourseInterface;
}

export const CourseStructurePage: NextPage<CourseEditorPageProps> = ({
  course,
}) => {
  const { t } = useTranslation("course_settings");
  return (
    <CourseEditorLayout name={course.name} published={course.published} t={t}>
      <SeoTags
        title={`CourseLab | Structure | ${course.public_name}`}
        description={`The structure settings for your course`}
      />
      <Page course={course} t={t} />
    </CourseEditorLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query, locale }) => {
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
          course,
          ...(await serverSideTranslations(locale!, [
            "common",
            "course_settings",
          ])),
        },
      };
    }
  }
);
