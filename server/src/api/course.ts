import { prismaClient } from "../index";
import { Router } from "express";
import { isAuth } from "../functions/auth";
import { uploadCourseImg } from "../settings/multer";
import sharp from "sharp";
import path from "path";
import { existsSync, renameSync, unlinkSync } from "fs";
import { initialDocData } from "./document";
import { deleteCache, getOrSetCache } from "../functions/redisCaching";

const router = Router();

router.post(
  "/create",
  isAuth,
  uploadCourseImg.single("image"),
  async (req, res) => {
    try {
      const { name, public_name, description } = req.body;

      if (!name) {
        res.status(400).send("Name must be provided");
      }

      const nameCheck = await prismaClient.course.findUnique({
        where: { name },
      });

      if (nameCheck) {
        res.status(400).send("Course name already in use.");
      }

      const image_path = req.file?.path;

      if (image_path) {
        await sharp(image_path)
          .resize({
            fit: sharp.fit.contain,
            width: 500,
          })
          .toFile(
            path
              .resolve(req.file?.destination!, req.file?.filename!)
              .replace("-org", "")
          );

        unlinkSync(image_path);
      }

      const course = await prismaClient.course.create({
        data: {
          name,
          public_name,
          details: {
            description,
          },
        },
      });

      await prismaClient.courseEnrollment.create({
        data: {
          user: {
            connect: {
              id: req.session.user?.id,
            },
          },
          course: {
            connect: {
              name: course.name,
            },
          },
          role: "ADMIN",
        },
      });

      deleteCache(`drafts?userId=${req.session.user?.id}`);
      return res.status(201).send(course.name);
    } catch (err) {
      return res.status(400).send("Somethin went wrong");
    }
  }
);

router.post(
  "/cicon/:name",
  uploadCourseImg.single("image"),
  async (_req, res) => {
    try {
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
);

router.get("/mydrafts", isAuth, async (req, res) => {
  try {
    const drafts = await getOrSetCache(
      `drafts?userId=${req.session.user?.id}`,
      async () => {
        const data = await prismaClient.course.findMany({
          where: {
            published: false,
            members: {
              some: {
                role: `ADMIN`,
                user: {
                  id: req.session.user?.id,
                },
              },
            },
          },
        });
        return data;
      }
    );

    return res.status(200).json(drafts);
  } catch (err) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.get("/fetchadmin/:name", isAuth, async (req, res) => {
  try {
    const name = req.params.name;

    const course = await getOrSetCache(`course?edit:${name}`, async () => {
      const data = await prismaClient.course.findFirst({
        where: {
          name,
          members: {
            some: {
              user: {
                id: req.session.user?.id,
              },
              role: "ADMIN",
            },
          },
        },
        select: {
          name: true,
          public_name: true,
          published: true,
          model: true,
          details: true,
          weeks: true,
          dataModels: {
            select: {
              id: true,
              name: true,
              props: true,
              type: true,
              document_id: true,
              video_id: true,
              assignment_id: true,
              quiz_id: true,
              course_id: true,
            },
          },
        },
      });

      return data;
    });

    return res.status(200).json(course);
  } catch (err) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get("/mycourses", isAuth, async (req, res) => {
  try {
    const courses = getOrSetCache(``, async () => {
      const data = await prismaClient.courseEnrollment.findMany({
        where: { user_id: req.session.user?.id },
      });
      return data;
    });

    return res.status(200).send(courses);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post(
  "/savechanges",
  isAuth,
  uploadCourseImg.single("image"),
  async (req, res) => {
    try {
      await prismaClient.course.update({
        where: {
          name: req.body.name,
        },
        data: {
          name: req.body.name,
          public_name: req.body.public_name,
          details: {
            description: req.body.description,
          },
        },
      });

      const apath = path.join(
        __dirname,
        `../../images/courseImage/${req.body.old_name}.jpg`
      );

      if (existsSync(apath))
        renameSync(apath, apath.replace(req.body.old_name, req.body.name));

      const image_path = req.file?.path;

      if (image_path) {
        await sharp(image_path)
          .resize({
            fit: sharp.fit.contain,
            width: 500,
          })
          .toFile(
            path
              .resolve(req.file?.destination!, req.file?.filename!)
              .replace("-org", "")
          );

        unlinkSync(image_path);
      }

      deleteCache(`course?edit:${req.body.name}`);
      return res.sendStatus(201);
    } catch (err) {
      return res.status(400).send("Something went wrong");
    }
  }
);

router.post(`/data/save`, isAuth, async (req, res) => {
  try {
    const { weeks } = req.body;

    const course = await prismaClient.course.update({
      where: {
        name: req.body.name,
      },
      data: {
        weeks,
      },
    });

    deleteCache(`course?edit:${req.body.name}`);
    return res.status(200).send(course);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
});

router.post("/coursedata", isAuth, async (req, res) => {
  try {
    const { type, week, day, index, name, courseName } = req.body;

    if (type === "Document") {
      const dataModel = await prismaClient.courseDataModel.create({
        data: {
          name,
          type: "DOCUMENT",
          props: {
            week,
            day,
            index,
          },
          course: {
            connect: {
              name: courseName,
            },
          },
          document: {
            create: {
              name,
              file: initialDocData,
              members: {
                create: [
                  {
                    user: {
                      connect: {
                        id: req.session.user?.id,
                      },
                    },
                    role: "ADMIN",
                  },
                ],
              },
            },
          },
        },
      });
      deleteCache(`course?edit:${courseName}`);
      return res.status(201).send(dataModel);
    } else if (type === "Video") {
      const dataModelVideo = await prismaClient.courseDataModel.create({
        data: {
          name,
          type: "VIDEO",
          props: {
            week,
            day,
            index,
          },
          course: {
            connect: {
              name: courseName,
            },
          },
          video: {
            create: {
              name,
            },
          },
        },
      });
      deleteCache(`course?edit:${courseName}`);
      return res.status(201).send(dataModelVideo);
    } else if (type === "Assignment") {
      const dataModelAssignment = await prismaClient.courseDataModel.create({
        data: {
          name,
          type: "ASSIGNMENT",
          props: {
            week,
            day,
            index,
          },
          course: {
            connect: {
              name: courseName,
            },
          },
          assignment: {
            create: {
              name,
              members: {
                create: [
                  {
                    user: {
                      connect: {
                        id: req.session.user?.id,
                      },
                    },
                    role: "ADMIN",
                  },
                ],
              },
            },
          },
        },
      });
      deleteCache(`course?edit:${courseName}`);
      return res.status(201).send(dataModelAssignment);
    } else if (type === "Quiz") {
      const dataModelQuizz = await prismaClient.courseDataModel.create({
        data: {
          name,
          type: "QUIZ",
          props: {
            week,
            day,
            index,
          },
          course: {
            connect: {
              name: courseName,
            },
          },
          quiz: {
            create: {
              name,
            },
          },
        },
      });

      deleteCache(`course?edit:${courseName}`);
      return res.status(201).send(dataModelQuizz);
    } else {
      deleteCache(`course?edit:${courseName}`);
      return res.status(201).send(true);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/delete/:name", isAuth, async (req, res) => {
  try {
    const deletedData = await prismaClient.courseDataModel.delete({
      where: {
        id: req.params.name,
      },
    });

    if (deletedData.type === "DOCUMENT") {
      await prismaClient.document.delete({
        where: {
          id: deletedData.document_id!,
        },
      });
    } else if (deletedData.type === "VIDEO") {
      const video = await prismaClient.video.delete({
        where: {
          id: deletedData.video_id!,
        },
      });

      unlinkSync(path.join(__dirname, `../../videos/${video.path}`));
    } else if (deletedData.type === "ASSIGNMENT") {
      await prismaClient.assignment.delete({
        where: {
          id: deletedData.assignment_id!,
        },
      });
    }

    deleteCache(`course?edit:${req.params.name}`);

    return res.status(200).send(deletedData.id);
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
