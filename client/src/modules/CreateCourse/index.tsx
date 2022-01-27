import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import useSWR from "swr";
import { CourseInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

interface CreateCoursePageProps {
  drafts: CourseInterface[];
}

export const CreateCoursePage: NextPage<CreateCoursePageProps> = ({
  drafts,
}) => {
  const { data } = useSWR(`${baseurl}/course/mydrafts`, {
    fallbackData: drafts,
  });

  return (
    <MainLayout>
      <Page drafts={data || drafts} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    try {
      const drafts = await axios.get(`${baseurl}/course/mydrafts`, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie,
        },
      });

      return { props: { user: req.user, drafts: drafts.data } };
    } catch (error) {
      return { props: { user: undefined, drafts: null } };
    }
  }
);
