import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Error401 from "../../components/Error401";
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
      <Head>
        <title>CourseLab | Quiz edtior - {quiz.name || "Error"}</title>
        <meta name="description" content="Quiz editor" />
        <meta
          name="og:title"
          content={`CourseLab | Quiz editor - ${quiz.name || "Error"}`}
        />
      </Head>
      {quiz ? <Page quiz={quiz} /> : <Error401 />}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const quizId = typeof query.id === "string" ? query.id : "";

    try {
      const quizRes = await axios.get(`${baseurl}/quiz/${quizId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return { props: { user: req.user, quiz: quizRes.data } };
    } catch (error) {
      return { props: { quiz: null, user: req.user } };
    }
  }
);
