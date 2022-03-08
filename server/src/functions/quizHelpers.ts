import { CourseEnrollment, QuizQuestion, QuizSubmit } from "@prisma/client";

type Distribution = CourseEnrollment & {
  quizzes: QuizSubmit[];
};

type QuizQuestionAnswer = {
  question: string;
  correct: boolean;
  option: string;
};

export const submitsDitribution = (members: Distribution[]) => {
  const submitted: Distribution[] = [];
  const missing: Distribution[] = [];
  members.forEach((mmbr) => {
    if (mmbr.quizzes.length) submitted.push(mmbr);
    else missing.push(mmbr);
  });

  return { submitted, missing };
};

export const calculatePoints = (
  questions: QuizQuestion[],
  answers: QuizQuestionAnswer[]
) => {
  let points = 0;
  questions.forEach((question) => {
    const answer = answers.find((ans) => ans.question === question.id);
    if (answer?.correct) points += question.points!;
  });

  return points;
};
