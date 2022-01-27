import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import useSWR from "swr";
import { CourseInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import Page from "./Page";

interface CourseEditorPageProps {
  course: CourseInterface;
}

export const CreateCoursePage: NextPage<CourseEditorPageProps> = ({
  course,
}) => {
  const { data } = useSWR<CourseInterface>(
    `${baseurl}/course/fetchadmin/${course.name}`,
    {
      fallbackData: course,
    }
  );

  return <Page course={data || course} />;
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
      console.log(req.user);

      return {
        props: {
          user: req.user,
          course: courseRes.data,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        props: {
          user: undefined,
          course,
        },
      };
    }
  }
);
