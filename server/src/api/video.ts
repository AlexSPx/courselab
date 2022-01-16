import { Router } from "express";
import { createReadStream, statSync } from "fs";
import { extname, join } from "path";
import { prismaClient } from "../";
import { isAuth } from "../functions/auth";
import { uploadVideo } from "../settings/multer";

const router = Router();

router.post(
  "/upload",
  isAuth,
  uploadVideo.single("video"),
  async (req, res) => {
    try {
      await prismaClient.video.update({
        where: {
          id: req.body.videoId,
        },
        data: {
          path: req.body.path,
          name: req.body.name,
        },
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);

      return res.status(400).send("Somethin went wrong");
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const video = await prismaClient.video.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        questions: {
          include: {
            VideoAnswers: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                  },
                },
              },
            },
            author: {
              select: {
                id: true,
                username: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
          where: {
            parentQuestionId: null,
          },
          orderBy: {
            date: "asc",
          },
        },
        courseDataModel: true,
      },
    });

    return res.status(200).send(video);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.get("/stream/:path", isAuth, async (req, res) => {
  try {
    const range = req.headers.range;

    if (!range) return res.status(400).send("Range required");

    const videoPath = join(__dirname + `../../../videos/${req.params.path}`);

    const videoSize = statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range?.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Range": "bytes",
      "Content-Length": contentLength,
      "Content-Type": `video/${extname(videoPath)}`,
    };

    const stream = createReadStream(videoPath, { start, end });
    stream.pipe(res);

    return res.status(206).header(headers);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Somethin went wrong");
  }
});

router.post("/question", async (req, res) => {
  try {
    const { content, timestamp, authorId, videoId, parentQuestionId } =
      req.body;

    if (parentQuestionId) {
      const questionResponse = await prismaClient.videoQuestion.create({
        data: {
          content,
          timestamp,
          author: {
            connect: {
              id: authorId,
            },
          },
          parentQuestion: {
            connect: {
              id: parentQuestionId,
            },
          },
          video: {
            connect: {
              id: videoId,
            },
          },
        },
        include: {
          VideoAnswers: true,
          author: {
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

      return res.status(200).send(questionResponse);
    }

    const question = await prismaClient.videoQuestion.create({
      data: {
        content,
        answered: false,
        timestamp,
        is_answer: false,
        author: {
          connect: {
            id: authorId,
          },
        },
        video: {
          connect: {
            id: videoId,
          },
        },
      },
      include: {
        VideoAnswers: true,
        author: {
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

    return res.status(200).send(question);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.post("/answer", async (req, res) => {
  const { parentQuestionId, responseId } = req.body;
  try {
    const isAlreadyAnswered = await prismaClient.videoQuestion.findUnique({
      where: {
        id: parentQuestionId,
      },
    });

    if (!isAlreadyAnswered?.answered) {
      await prismaClient.videoQuestion.update({
        where: {
          id: responseId,
        },
        data: {
          is_answer: true,
        },
      });

      await prismaClient.videoQuestion.update({
        where: {
          id: parentQuestionId,
        },
        data: {
          answered: true,
        },
      });
      return res.sendStatus(200);
    }

    // Demote current answer
    await prismaClient.videoQuestion.updateMany({
      where: {
        is_answer: true,
      },
      data: {
        is_answer: false,
      },
    });

    // Promote new answer
    const promoted = await prismaClient.videoQuestion.update({
      where: {
        id: responseId,
      },
      data: {
        is_answer: true,
      },
    });

    return res.status(200).send({ promotedId: promoted.id });
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.delete("/question/delete", async (req, res) => {
  try {
    await prismaClient.videoQuestion.delete({
      where: {
        id: req.body.id,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

export default router;
