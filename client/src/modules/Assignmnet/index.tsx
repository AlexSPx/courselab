import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Error401 from "../../components/Error401";
import SeoTags from "../../components/SeoTags";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type AssignmentPageProps = {
  assignment: AssignmentInterface;
};

export const AssignmentPage: NextPage<AssignmentPageProps> = ({
  assignment,
}) => {
  return (
    <MainLayout>
      <SeoTags
        title={`CourseLab | Assignment - ${assignment.name || "Error"}`}
        description="assignment page"
      />

      {assignment ? <Page assignment={assignment} /> : <Error401 />}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query, locale }) => {
    const assignmentId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(`${baseurl}/assignment/${assignmentId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          assignment: res.data,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          assignment: null,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    }
  }
);
