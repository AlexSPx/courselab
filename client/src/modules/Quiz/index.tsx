import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import Error401 from "../../components/Error401";
import { Enrollment, QuizInterface, QuizSubmit } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";
import SubmitDone from "./SubmitDone";

type QuizPageProps = {
  quiz:
    | (QuizInterface & {
        courseDataModel: {
          course: {
            members: Enrollment[];
          };
        };
      })
    | null;
  submitInit: QuizSubmit | null;
};

export const QuizPage: NextPage<QuizPageProps> = ({ quiz, submitInit }) => {
  const [submit, setSubmit] = useState(submitInit);

  return (
    <MainLayout css="overflow-auto bg-gray-50">
      <Head>
        <title>CourseLab | Quiz - {quiz?.name || "Error"}</title>
        <meta name="description" content="Quiz page" />
        <meta
          name="og:title"
          content={`CourseLab | Quiz page - ${quiz?.name || "Error"}`}
        />
      </Head>
      {submit ? (
        <SubmitDone submit={submit} />
      ) : quiz ? (
        <Page quiz={quiz} setSubmit={setSubmit} />
      ) : (
        <Error401 />
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const quizId = typeof query.id === "string" ? query.id : "";

    try {
      const quizRes = await axios.get(`${baseurl}/quiz/take/${quizId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          quiz: quizRes.data.quiz,
          submitInit: quizRes.data.submit,
        },
      };
    } catch (error) {
      return { props: { quiz: null, submitInit: null, user: req.user } };
    }
  }
);
