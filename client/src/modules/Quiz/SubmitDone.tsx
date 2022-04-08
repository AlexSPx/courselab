import { TFunction } from "react-i18next";
import React from "react";
import { QuizSubmit } from "../../interfaces";
import { Main } from "../Layouts/MainLayout";

export default function SubmitDone({
  submit,
  t,
}: {
  submit: QuizSubmit;
  t: TFunction;
}) {
  return (
    <Main css="max-w-2xl items-center">
      <span className="text-2xl font-bold">{submit.Quiz.name}</span>
      <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
        <h5 className="text-xl font-bold text-gray-900">
          {t("quiz-description")}
        </h5>
        <p className="mt-2 text-gray-500">{submit.Quiz.description}</p>
      </div>
      <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
        <h5 className="text-xl font-bold text-gray-900">{t("submit")}</h5>
        <div className="flex flex-row items-center mt-2">
          <p>{t("your-points")}</p>
          <p className="text-gray-500 mx-1">
            {submit.points}/{submit.maxPoints}
          </p>
        </div>
        {!submit.returned && (
          <p className="text-sm italic mt-3">{t("awaiting-check")}</p>
        )}
      </div>
    </Main>
  );
}
