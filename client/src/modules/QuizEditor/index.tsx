import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Error401 from "../../components/Error401";
import SeoTags from "../../components/SeoTags";
import { QuizInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type QuizEditorProps = {
  quiz: QuizInterface;
};

export const QuizEditor: NextPage<QuizEditorProps> = ({ quiz }) => {
  return (
    <MainLayout css="overflow-auto bg-gray-50">
      <SeoTags
        title={`CourseLab | Quiz editor - ${quiz.name || "Error"}`}
        description="Quiz editor"
      />
      {quiz ? <Page quiz={quiz} /> : <Error401 />}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query, locale }) => {
    const quizId = typeof query.id === "string" ? query.id : "";

    try {
      const quizRes = await axios.get(`${baseurl}/quiz/${quizId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          quiz: quizRes.data,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    } catch (error) {
      return {
        props: {
          quiz: null,
          user: req.user,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    }
  }
);
