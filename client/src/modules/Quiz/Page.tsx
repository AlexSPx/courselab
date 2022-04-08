import axios from "axios";
import { TFunction } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Enrollment,
  QuizInterface,
  QuizSubmit,
  QuizzQuestionInterface,
} from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import useRequest from "../../lib/useRequest";
import { Main } from "../Layouts/MainLayout";

export default function Page({
  quiz,
  setSubmit,
  t,
}: {
  quiz: QuizInterface & {
    courseDataModel: {
      course: {
        members: Enrollment[];
      };
    };
  };
  setSubmit: Dispatch<SetStateAction<QuizSubmit | null>>;
  t: TFunction;
}) {
  const [answers, setAnswers] = useState<Object>();
  const [filledQuestions, setFilledQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const questions = useMemo(
    () => quiz.questions.sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1)),
    [quiz.questions]
  );

  const { executeQuery } = useRequest();

  useEffect(() => {
    setAnswers(() => {
      const temp: Object = {};

      questions.forEach((q) => {
        Object.assign(temp, { [q.id]: null });
      });

      return temp;
    });
  }, [questions]);

  useEffect(() => {
    if (!answers) return;
    let i = 0;
    Object.entries(answers).forEach((w) => {
      if (!(w[1] === null) && !(w[1] === "")) i++;
    });

    setFilledQuestions(i);
  }, [answers]);

  const handleSubmit = () => {
    if (quiz.questions.length > filledQuestions) {
      setError(
        `${t("empty-error")} - ${filledQuestions}/${quiz.questions.length}`
      );
      return;
    }

    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/quiz/validate`,
          {
            quizId: quiz.id,
            answers,
            enrollment: quiz.courseDataModel.course.members[0].id,
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingBody: "Checking your answers",
        successBody: "Results are fetching...",
        onSuccess: (res) => setSubmit(res.data),
      }
    );
  };

  const mapQuestions = questions.map((question) => {
    const handleChange = (answer: string) => {
      if (!answers) return;
      setAnswers({ ...answers, [question.id]: answer });
    };

    // const handleEmpty = () => {
    //   if (!answers) return;
    //   const aq = Object.entries(answers).find((w) => w[0] === question.id);

    //   if(aq){
    //     if(aq[1] === null || aq[1] === ''){

    //     }
    //   }
    // };
    // handleEmpty();
    if (question.type === "OPENED") {
      return (
        <OpenedQuestion
          question={question}
          change={handleChange}
          pointsLabel={t("points")}
        />
      );
    }
    if (question.type === "CLOSED") {
      return (
        <ClosedQuestion
          question={question}
          change={handleChange}
          pointsLabel={t("points")}
        />
      );
    }

    return <></>;
  });

  return (
    <>
      <Main css="items-center max-w-2xl">
        <span className="text-2xl font-bold">{quiz.name}</span>
        <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
          <h5 className="text-xl font-bold text-gray-900">
            {t("quiz-description")}
          </h5>
          <p className="mt-2 text-gray-500">{quiz.description}</p>
        </div>
        <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
          <p>
            {filledQuestions}/{quiz.questions.length}
          </p>
          {mapQuestions}
        </div>
        {error && (
          <div
            className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3 hover:bg-gray-50 hover:shadow-gray-300 cursor-pointer"
            onClick={() => setError(null)}
          >
            <p className="text-red-500 font-mono">{error}</p>
          </div>
        )}
        <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
          <button
            className="btn btn-outline w-full my-3"
            onClick={handleSubmit}
            aria-label="submit the quiz"
          >
            {t("submit")}
          </button>
        </div>
      </Main>
    </>
  );
}

const ClosedQuestion = ({
  question,
  change,
  pointsLabel,
}: {
  question: QuizzQuestionInterface;
  change: (answer: string) => void;
  pointsLabel: string;
}) => {
  const options = question.options?.map((option) => {
    return (
      <label className="cursor-pointer flex items-center" key={option}>
        <input
          type="radio"
          name="opt"
          className="radio"
          value={option}
          onChange={() => change(option)}
        />
        <span className="label-text my-1 mx-3">{option}</span>
      </label>
    );
  });

  return (
    <form
      className="flex flex-col form-control w-full my-2 p-2 bg-gray-50 select-none relative group rounded"
      key={question.id}
    >
      <p className="text-lg max-w-[85%]">{question.question}</p>
      <p className="absolute top-3 right-3 text-sm text-gray-700 italic">
        {pointsLabel}: {question.points}
      </p>
      {options}
    </form>
  );
};

const OpenedQuestion = ({
  question,
  change,
  pointsLabel,
}: {
  question: QuizzQuestionInterface;
  change: (answer: string) => void;
  pointsLabel: string;
}) => {
  return (
    <form
      className="flex flex-col form-control w-full my-2 p-2 bg-gray-50 select-none relative group rounded"
      key={question.id}
    >
      <p className="text-lg max-w-[85%]">{question.question}</p>
      <p className="absolute top-3 right-3 text-sm text-gray-700 italic">
        {pointsLabel}: {question.points}
      </p>
      <input
        type="text"
        className="input input-bordered my-2"
        onChange={(e) => change(e.target.value)}
      />
    </form>
  );
};
