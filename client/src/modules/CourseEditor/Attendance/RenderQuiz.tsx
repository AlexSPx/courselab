import axios from "axios";
import { TFunction, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import FormatDate from "../../../components/FormatDate";
import { useModals } from "../../../components/Modal";
import GradeQuiz from "../../../components/Modal/Menus/GradeQuiz";
import {
  Enrollment,
  GeneralUserInformation,
  QuizInterface,
  QuizSubmit,
} from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";

export type QuizSubmitType = Enrollment & {
  quizzes: QuizSubmit[];
  user: GeneralUserInformation;
};

export default function RenderQuiz({
  id,
  courseName,
  startingDate,
}: {
  id: string;
  courseName: string;
  startingDate: Date | null;
}) {
  const [submitted, setSubmitted] = useState<QuizSubmitType[]>();
  const [missing, setMissing] = useState<QuizSubmitType[]>();
  const { t } = useTranslation("course_settings");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post(
        `${baseurl}/quiz/submits/details`,
        { quizId: id, course: courseName, startingDate },
        { withCredentials: true }
      );

      setSubmitted(res.data.submitted);
      setMissing(res.data.missing);
    };
    fetch();
  }, [courseName, id, startingDate]);

  const mapSubmitted = submitted?.map((submit, index) => {
    return (
      <Submited
        quiz={submit}
        setSubmits={setSubmitted}
        index={index}
        key={`submittedquiz#${submit.id}`}
        t={t}
      />
    );
  });

  const mapMissing = missing?.map((submit, index) => {
    return (
      <Missing quiz={submit} index={index} key={`missingquiz#${submit.id}`} />
    );
  });

  return (
    <div className="overflow-w-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>{t("user-name")}</th>
            <th className="hidden md:table-cell">{t("username")}</th>
            <th className="hidden md:table-cell">{t("submitted-on")}</th>
            <th className="hidden md:table-cell">{t("submits")}</th>
            <th>{t("attachments")}</th>
          </tr>
        </thead>
        <tbody>{mapSubmitted}</tbody>
        <tbody>{mapMissing}</tbody>
      </table>
    </div>
  );
}

const Submited = ({
  quiz,
  setSubmits,
  index,
  t,
}: {
  quiz: QuizSubmitType;
  setSubmits: React.Dispatch<
    React.SetStateAction<QuizSubmitType[] | undefined>
  >;
  index: number;
  t: TFunction;
}) => {
  const { pushModal, closeModal } = useModals();

  const handleOpen = () => {
    const akey = `greadeq#${new Date()}`;
    pushModal(
      <GradeQuiz
        onClose={() => closeModal(akey)}
        key={akey}
        setSubmits={setSubmits}
        submit={quiz}
        t={t}
      />,
      {
        timer: false,
      }
    );
  };

  return (
    <tr
      key={`submit#${index}`}
      className="hover cursor-pointer font-semibold"
      onClick={handleOpen}
    >
      <td>{index}</td>
      <td>
        {quiz.user.first_name} {quiz.user.last_name}
      </td>
      <td className="hidden md:table-cell">@{quiz.user.username}</td>
      <td className="hidden md:table-cell">
        <FormatDate date={quiz.quizzes[0].dateOfSubmit} />
      </td>
      <td className="hidden md:table-cell">
        {quiz.quizzes[0].points}/{quiz.quizzes[0].maxPoints}
      </td>
      <td>{quiz.quizzes[0].returned ? "Returned" : "Not Returned"}</td>
    </tr>
  );
};

const Missing = ({ quiz, index }: { quiz: QuizSubmitType; index: number }) => {
  return (
    <tr className="table-compact font-semibold text-rose-700 hover cursor-pointer">
      <td>{index}</td>
      <td>
        {quiz.user.first_name} {quiz.user.last_name}
      </td>
      <td className="hidden md:table-cell">@{quiz.user.username}</td>
      <td className="hidden md:table-cell">-</td>
      <td className="hidden md:table-cell">-</td>
      <td>-</td>
    </tr>
  );
};
