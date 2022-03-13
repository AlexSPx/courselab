import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { CourseGeneralRawInterface } from "..";
import SeoTags from "../../../components/SeoTags";
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
      <SeoTags
        title={`CourseLab | ${course.public_name}`}
        description={`Course page for ${course.public_name} | ${course.name}`}
      />
      <Page courseRaw={course} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req }) => {
    const course = typeof query.name === "string" ? query.name : "";
    const { data } = await axios.get(`${baseurl}/course/${course}`);

    return {
      props: {
        course: data || null,
        user: req.user || null,
      },
    };
  },
  { requiresAuth: null }
);
