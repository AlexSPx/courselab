import axios from "axios";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import useSWR from "swr";
import { CourseInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { isServer } from "../../lib/isServer";
import { WithAuth } from "../Auth/withAuth";
import AuthHeader from "../Layouts/AuthHeaders";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

interface CreateCoursePageProps {
  drafts: CourseInterface[];
}

export const CreateCoursePage: NextPage<CreateCoursePageProps> = ({
  drafts,
}) => {
  const { data } = useSWR(`${baseurl}/course/mydrafts`, fetcher, {
    fallbackData: drafts,
  });

  return (
    <WithAuth>
      <AuthHeader />
      <MainLayout>
        <Page drafts={data || drafts} />
      </MainLayout>
    </WithAuth>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const drafts = await axios.get(`${baseurl}/course/mydrafts`, {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    });

    return { props: { drafts: drafts.data } };
  } catch (error) {
    return { props: { drafts: null } };
  }
};
