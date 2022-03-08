import { QuizQuestion } from "@prisma/client";
import { Router } from "express";
import { calculatePoints, submitsDitribution } from "../functions/quizHelpers";
import { prismaClient } from "../";
import { isAuth } from "../middlewares/auth";
const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  try {
    const quiz = await prismaClient.quiz.findFirst({
      where: {
        id: req.params.id,
        courseDataModel: {
          course: {
            members: {
              some: {
                user_id: req.session.user?.id,
                role: "ADMIN" || "TEACHER",
              },
            },
          },
        },
      },
      include: {
        questions: true,
      },
    });
    return res.status(200).send(quiz);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.post("/changes", isAuth, async (req, res) => {
  try {
    await prismaClient.quiz.update({
      where: {
        id: req.body.id,
      },
      data: req.body.data,
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    await prismaClient.quiz.deleteMany({
      where: {
        id: req.params.id,
        courseDataModel: {
          course: {
            members: {
              some: {
                user_id: req.session.user?.id,
              },
            },
          },
        },
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.post("/questions", isAuth, async (req, res) => {
  const noId = ({ id, ...rest }: { id: string }) => rest;
  try {
    await req.body.questions.map(async (question: QuizQuestion) => {
      await prismaClient.quizQuestion.upsert({
        where: {
          id: question.id,
        },
        update: noId(question),
        create: {
          question: question.question,
          answer: question.answer,
          options: question.options || [],
          orderIndex: question.orderIndex,
          type: question.type,
          points: question.points,
          Quizz: {
            connect: {
              id: req.body.quizId,
            },
          },
        },
      });
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get("/take/:id", isAuth, async (req, res) => {
  try {
    const submit = await prismaClient.quizSubmit.findFirst({
      where: {
        quiz_id: req.params.id,
        Enrollment: {
          user_id: req.session.user?.id,
        },
      },
      include: {
        Quiz: true,
      },
    });

    console.log(submit);

    if (submit) {
      return res.status(200).json({ submit, quiz: null });
    }

    const quiz = await prismaClient.quiz.findFirst({
      where: {
        id: req.params.id,
        courseDataModel: {
          course: {
            members: {
              some: {
                user_id: req.session.user?.id,
                role: "STUDENT",
              },
            },
          },
        },
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
            orderIndex: true,
            points: true,
            type: true,
          },
        },
        courseDataModel: {
          select: {
            course: {
              select: {
                members: {
                  where: {
                    user_id: req.session.user?.id,
                    role: "STUDENT",
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ quiz, submit: null });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/validate", isAuth, async (req, res) => {
  try {
    const quiz = await prismaClient.quiz.findUnique({
      where: {
        id: req.body.quizId,
      },
      include: {
        questions: true,
      },
    });

    const validated: { question: string; option: string; correct: boolean }[] =
      [];
    let points = 0;
    let max = 0;
    Object.entries(req.body.answers).forEach((answer) => {
      const ans = quiz?.questions.find((an) => an.id === answer[0]);
      max += ans?.points!;
      if (ans?.answer.includes(answer[1] as string)) {
        points += ans.points!;
        validated.push({
          question: answer[0],
          option: answer[1] as string,
          correct: true,
        });
      } else {
        validated.push({
          question: answer[0],
          option: answer[1] as string,
          correct: false,
        });
      }
    });

    const submit = await prismaClient.quizSubmit.create({
      data: {
        Enrollment: {
          connect: {
            id: req.body.enrollment,
          },
        },
        Quiz: {
          connect: {
            id: req.body.quizId,
          },
        },
        answers: validated,
        points: points,
        maxPoints: max,
      },
      include: {
        Quiz: true,
      },
    });

    return res.status(200).send(submit);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/submits/details", isAuth, async (req, res) => {
  try {
    const all = await prismaClient.courseEnrollment.findMany({
      where: {
        course_id: req.body.course,
        startingAt: req.body.startingDate,
        role: "STUDENT",
        quizzes: {
          some: {
            quiz_id: req.body.quizId,
          },
        },
      },
      include: {
        quizzes: {
          where: {
            quiz_id: req.body.quizId,
          },
          include: {
            Quiz: {
              include: {
                questions: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    const { submitted, missing } = submitsDitribution(all);
    return res.status(200).send({ submitted, missing });
  } catch (error) {
    return res.status(400).send(JSON.stringify(error));
  }
});

router.post(`/submits/return`, isAuth, async (req, res) => {
  try {
    const isAdmin = await prismaClient.quiz.findFirst({
      where: {
        courseDataModel: {
          course: {
            members: {
              some: {
                user_id: req.session.user?.id,
                role: "ADMIN" || "TEACHER",
              },
            },
          },
        },
      },
    });

    if (!isAdmin) return res.status(400).send("Not authorized");

    const updatedPoints = calculatePoints(
      req.body.questions,
      req.body.updatedAnswers
    );

    const returnedSubmit = await prismaClient.quizSubmit.update({
      where: {
        id: req.body.submitId,
      },
      data: {
        answers: req.body.updatedAnswers,
        points: updatedPoints,
        returned: true,
      },
      include: {
        Quiz: true,
      },
    });
    return res.status(200).send(returnedSubmit);
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
