import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Modal from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { QuizGivenAnswer, QuizzQuestionInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import useRequest from "../../../lib/useRequest";
import { QuizSubmitType } from "../../../modules/CourseEditor/Attendance/RenderQuiz";
import FormatDate from "../../FormatDate";

export default function GradeQuiz({
  onClose,
  submit,
  setSubmits,
}: {
  onClose: Function;
  submit: QuizSubmitType;
  setSubmits: React.Dispatch<
    React.SetStateAction<QuizSubmitType[] | undefined>
  >;
}) {
  const [answers, setAnswers] = useState<QuizGivenAnswer[]>(
    submit.quizzes[0].answers
  );

  const { executeQuery } = useRequest();

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, () => onClose());
  const handleReturn = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/quiz/submits/return`,
          {
            questions: submit.quizzes[0].Quiz.questions,
            updatedAnswers: answers,
            submitId: submit.quizzes[0].id,
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Returning",
        loadingBody: "Returning quiz",
        successTitle: "Quiz submit has been returned",
        onSuccess: (res) => {
          setSubmits((submits) =>
            submits?.map((submit) => {
              console.log(submit);

              console.log({ ...submit, quizzes: [res.data.id] });

              return submit.quizzes[0].id === res.data.id
                ? { ...submit, quizzes: [res.data] }
                : submit;
            })
          );
        },
      }
    );
  };

  const mapQuestions = submit.quizzes[0].Quiz.questions.map((question) => {
    const changeAnswer = (correct: boolean) => {
      setAnswers(
        answers.map((answer) =>
          answer.question === question.id
            ? { correct, option: answer.option, question: question.id }
            : answer
        )
      );
    };

    if (question.type === "OPENED") {
      return (
        <OpenedQuestion
          question={question}
          givenAnswer={
            answers.find((answer) => answer.question === question.id)!
          }
          changeAnswer={changeAnswer}
          key={question.id}
        />
      );
    }
    if (question.type === "CLOSED") {
      return (
        <ClosedQuestion
          question={question}
          givenAnswer={
            answers.find((answer) => answer.question === question.id)!
          }
          changeAnswer={changeAnswer}
          key={question.id}
        />
      );
    }
  });

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-2/3 max-w-4xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-col w-full justify-center items-center">
            <p className="text-xl font-semibold font-mono pt-5">
              {submit.user.username}&apos;s submit
            </p>
          </div>
          <div className="divider w-full"></div>
          <div className="flex flex-col p-3 font-mono">
            <div className="mb-2">
              <p className="font-semibold">Submitted on:</p>
              <FormatDate date={submit.quizzes[0].dateOfSubmit} />
            </div>
            <div className="my-2">
              <p className="font-semibold">Questions:</p>
              <div
                className="flex flex-col p-1 font-sans max-h-[60vh] overflow-auto"
                id="journal-scroll"
              >
                {mapQuestions}
              </div>
            </div>
            <div className="flex flex-col w-full justify-center">
              <p className="font-semibold">Add a comment:</p>
            </div>
            <button className="btn btn-outline my-3" onClick={handleReturn}>
              {submit.quizzes[0].returned && "Update"} Return
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

const OpenedQuestion = ({
  question,
  givenAnswer,
  changeAnswer,
}: {
  question: QuizzQuestionInterface;
  givenAnswer: QuizGivenAnswer;
  changeAnswer: (correct: boolean) => void;
}) => {
  return (
    <div
      className={`flex flex-col form-control w-full my-2 p-2 bg-gray-50 select-none relative group rounded border ${
        givenAnswer.correct ? "border-green-400" : "border-red-400"
      }`}
    >
      <p className="text-lg max-w-[85%]">{question.question}</p>
      <p className="absolute top-3 right-3 text-sm text-gray-700 italic">
        points: {question.points}
      </p>
      <input
        type="text"
        className="input input-bordered my-2"
        defaultValue={givenAnswer.option}
        disabled
      />
      {givenAnswer.correct ? (
        <button
          className="btn btn-sm btn-outline mt-1"
          onClick={() => changeAnswer(false)}
        >
          Take Points
        </button>
      ) : (
        <button
          className="btn btn-sm btn-outline mt-1"
          onClick={() => changeAnswer(true)}
        >
          Give Points
        </button>
      )}
    </div>
  );
};

const ClosedQuestion = ({
  question,
  givenAnswer,
  changeAnswer,
}: {
  question: QuizzQuestionInterface;
  givenAnswer: QuizGivenAnswer;
  changeAnswer: (correct: boolean) => void;
}) => {
  const options = question.options?.map((option) => {
    return (
      <label className="cursor-pointer flex items-center" key={`cq${option}`}>
        <input
          type="radio"
          name="opt"
          className="radio"
          disabled={true}
          checked={option === givenAnswer.option ? true : false}
        />
        <span className="label-text my-1 mx-3">{option}</span>
      </label>
    );
  });

  return (
    <div
      className={`flex flex-col form-control w-full my-2 p-2 bg-gray-50 select-none relative group rounded border ${
        givenAnswer.correct ? "border-green-400" : "border-red-400"
      }`}
    >
      <p className="text-lg max-w-[85%]">{question.question}</p>
      <p className="absolute top-3 right-3 text-sm text-gray-700 italic">
        points: {question.points}
      </p>
      {options}
      {givenAnswer.correct ? (
        <button
          className="btn btn-sm btn-outline mt-1"
          onClick={() => changeAnswer(false)}
        >
          Take Points
        </button>
      ) : (
        <button
          className="btn btn-sm btn-outline mt-1"
          onClick={() => changeAnswer(true)}
        >
          Give Points
        </button>
      )}
    </div>
  );
};
