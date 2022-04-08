import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import Error401 from "../../components/Error401";
import SeoTags from "../../components/SeoTags";
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
  const { t } = useTranslation("docs");
  return (
    <MainLayout css="overflow-auto bg-gray-50">
      <SeoTags
        title={`CourseLab | Quiz page - ${quiz?.name || "Error"}`}
        description="Quiz page"
      />
      {submit ? (
        <SubmitDone submit={submit} t={t} />
      ) : quiz ? (
        <Page quiz={quiz} setSubmit={setSubmit} t={t} />
      ) : (
        <Error401 />
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query, locale }) => {
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
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    } catch (error) {
      return {
        props: {
          quiz: null,
          submitInit: null,
          user: req.user,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    }
  }
);
