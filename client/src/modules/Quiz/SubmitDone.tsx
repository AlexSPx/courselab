import React from "react";
import { QuizSubmit } from "../../interfaces";
import { Main } from "../Layouts/MainLayout";

export default function SubmitDone({ submit }: { submit: QuizSubmit }) {
  return (
    <Main css="max-w-2xl items-center">
      <span className="text-2xl font-bold">{submit.Quiz.name}</span>
      <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
        <h5 className="text-xl font-bold text-gray-900">Quiz Description</h5>
        <p className="mt-2 text-gray-500">{submit.Quiz.description}</p>
      </div>
      <div className="block p-4 bg-white border border-gray-100 w-full shadow-sm rounded-xl mt-3">
        <h5 className="text-xl font-bold text-gray-900">Submit</h5>
        <div className="flex flex-row items-center mt-2">
          <p>Your points are</p>
          <p className="text-gray-500 mx-1">
            {submit.points}/{submit.maxPoints}
          </p>
        </div>
        {!submit.returned && (
          <p className="text-sm italic mt-3">
            Your quiz has not been verified, yet. Your score might change.
          </p>
        )}
      </div>
    </Main>
  );
}
