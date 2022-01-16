import axios from "axios";
import { NextPage } from "next";
import { CourseInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import Page from "./Page";

interface CourseEditorPageProps {
  course: CourseInterface;
}

export const CreateCoursePage: NextPage<CourseEditorPageProps> = ({
  course,
}) => {
  return (
    <WithAuth>
      <AuthHeader />
      <Page course={course} />
    </WithAuth>
  );
};

CreateCoursePage.getInitialProps = async ({ query, req }) => {
  const course = typeof query.name === "string" ? query.name : "";

  try {
    const res = await axios.get(`${baseurl}/course/fetchadmin/${course}`, {
      withCredentials: true,
      headers: {
        cookie: req?.headers.cookie,
      },
    });

    return {
      course: res.data,
    };
  } catch (error) {
    return { course };
  }
};
