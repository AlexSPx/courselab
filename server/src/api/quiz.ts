import { Router } from "express";
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
    await req.body.questions.map(async (question: any) => {
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
    console.log(error);

    return res.status(400).send("Someting went wrong");
  }
});

export default router;
