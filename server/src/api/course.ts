import { prismaClient } from "../index";
import { Router } from "express";
import { isAuth } from "../middlewares/auth";
import {
  uplaodCourseImages,
  uplaodCourseSponsorImages,
  uploadCourseImg,
} from "../settings/multer";
import sharp from "sharp";
import path from "path";
import { existsSync, renameSync, unlinkSync } from "fs";
import { initialDocData } from "./document";
import { deleteCache, getOrSetCache } from "../functions/redisCaching";
import { Sponsor } from "../functions/misc";
import { deleteAttachments } from "../functions/courseHelpers";

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
            width: 600,
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
          ExtendedDetails: {
            create: {},
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

router.post("/enroll", isAuth, async (req, res) => {
  try {
    const check = await prismaClient.courseEnrollment.findFirst({
      where: {
        course_id: req.body.course,
        user_id: req.body.userId,
        startingAt: req.body.startingAt,
      },
    });

    if (check) {
      return res.status(400).send("You have already endolled in this course");
    }

    const enrollment = await prismaClient.courseEnrollment.create({
      data: {
        role: "STUDENT",
        AssignedAt: new Date(),
        startingAt: req.body.startingAt,
        course: {
          connect: {
            name: req.body.course,
          },
        },
        user: {
          connect: {
            id: req.body.userId,
          },
        },
      },
    });

    const course = await prismaClient.course.findFirst({
      where: {
        name: req.body.course,
      },
      select: {
        dataModels: true,
      },
    });

    course?.dataModels.forEach(async (dm) => {
      if (dm.assignment_id) {
        await prismaClient.assignmentsOnUsers.create({
          data: {
            enrollment: {
              connect: {
                id: enrollment.id,
              },
            },
            assignment: {
              connect: {
                id: dm.assignment_id,
              },
            },
            role: "STUDENT",
          },
        });
      }
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.get("/details/:name", isAuth, async (req, res) => {
  try {
    const details = await prismaClient.courseExtendedDetails.findUnique({
      where: {
        courseName: req.params.name,
      },
      include: {
        course: {
          select: {
            public_name: true,
            published: true,
          },
        },
      },
    });

    return res.status(200).send(details);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.post("/details/reviews/:name", isAuth, async (req, res) => {
  try {
    await prismaClient.courseExtendedDetails.update({
      where: {
        courseName: req.params.name,
      },
      data: { reviews: req.body.reviews },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.post(
  "/details/sponsor/:course/:sponsor",
  uplaodCourseSponsorImages.single("image"),
  isAuth,
  async (req, res) => {
    try {
      if (req.body.action === "UPLOAD") {
        if (!req.body.skip) {
          await prismaClient.courseExtendedDetails.update({
            where: {
              courseName: req.params.course,
            },
            data: {
              sponsors: {
                push: { name: req.params.sponsor, path: req.file?.filename },
              },
            },
          });

          return res.status(201).send({ path: req.file?.filename });
        }

        return res.status(400).send("Sponsor already exists");
      } else {
        const sponsors = (
          await prismaClient.courseExtendedDetails.findFirst({
            where: {
              courseName: req.params.course,
            },
            select: {
              sponsors: true,
            },
          })
        )?.sponsors as Sponsor[] | undefined;

        const apath = path.join(
          __dirname +
            `../../../images/courses/${
              sponsors?.find((sponsor) => sponsor.name === req.params.sponsor)
                ?.path
            }`
        );

        unlinkSync(apath);

        const updatedSponsors = sponsors?.filter(
          (sp: any) => sp.name !== req.params.sponsor
        );

        await prismaClient.courseExtendedDetails.update({
          where: {
            courseName: req.params.course,
          },
          data: {
            sponsors: updatedSponsors as any,
          },
        });

        return res.sendStatus(200);
      }
    } catch (error) {
      return res.status(400).send("Something went wrong");
    }
  }
);

router.post(
  "/details/images/:course",
  isAuth,
  uplaodCourseImages.array("images"),
  async (req, res) => {
    try {
      const course = req.params.course;

      let data = null;
      if (req.files) {
        const imgs = (req.files as Express.Multer.File[] | undefined)?.map(
          (f: Express.Multer.File) => f.filename
        );

        const uploaded = await prismaClient.courseExtendedDetails.update({
          where: {
            courseName: course,
          },
          data: {
            images: {
              push: imgs,
            },
          },
          select: {
            images: true,
          },
        });

        data = uploaded.images;
      }

      if (req.body.removed) {
        const initialImages = (
          await prismaClient.courseExtendedDetails.findFirst({
            where: {
              courseName: course,
            },
            select: {
              images: true,
            },
          })
        )?.images;

        const apath = (imgName: string) =>
          path.join(__dirname + `../../../images/courses/${imgName}`);

        const updated = initialImages?.filter((image) => {
          if (!req.body.removed.includes(image)) {
            return image;
          }
          unlinkSync(apath(image));
          return;
        });

        await prismaClient.courseExtendedDetails.update({
          where: {
            courseName: course,
          },
          data: {
            images: updated,
          },
        });

        data = updated;
      }

      return res.status(200).send(data);
    } catch (error) {
      return res.status(400).send("Something went wrong");
    }
  }
);

router.post("/details/desc/:course", isAuth, async (req, res) => {
  try {
    await prismaClient.courseExtendedDetails.update({
      where: {
        courseName: req.params.course,
      },
      data: {
        description: req.body.description,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.get("/mycourses", isAuth, async (req, res) => {
  try {
    const courses = await prismaClient.courseEnrollment.findMany({
      where: {
        user_id: req.session.user?.id,
        role: "STUDENT",
      },
      select: {
        id: true,
        course: {
          select: {
            name: true,
            public_name: true,
          },
        },
      },
    });

    return res.status(200).send(courses);
  } catch (error) {
    return res.status(400).send("Somethin went wrong");
  }
});

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

router.get("/mycourses/admin", isAuth, async (req, res) => {
  try {
    const courses = await prismaClient.course.findMany({
      where: {
        published: true,
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

    console.log(courses);

    return res.status(200).json(courses);
  } catch (err) {
    return res.status(400).send("Somethin went wrong");
  }
});

router.get("/fetchadmin/:name", isAuth, async (req, res) => {
  try {
    const name = req.params.name;

    console.log(req.session.user?.id);

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
          scheduleType: true,
          interval: true,
          scheduledDates: true,
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
    console.log(err);

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
          name: req.body.old_name,
        },
        data: {
          name: req.body.name,
          public_name: req.body.public_name,
          details: {
            description: req.body.description,
          },
          scheduleType: req.body.scheduleType,
          interval: JSON.parse(req.body.interval),
          scheduledDates: JSON.parse(req.body.scheduledDates),
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

router.post("/publish", isAuth, async (req, res) => {
  try {
    await prismaClient.course.updateMany({
      where: {
        name: req.body.name,
        members: {
          some: {
            user_id: req.session.user?.id,
            role: "ADMIN",
          },
        },
      },
      data: {
        published: true,
      },
    });

    deleteCache(`course?edit:${req.body.name}`);
    deleteCache(`drafts?userId=${req.session.user?.id}`);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.post("/unlist", isAuth, async (req, res) => {
  try {
    await prismaClient.course.updateMany({
      where: {
        name: req.body.name,
        members: {
          some: {
            user_id: req.session.user?.id,
            role: "ADMIN",
          },
        },
      },
      data: {
        published: false,
      },
    });

    deleteCache(`course?edit:${req.body.name}`);
    deleteCache(`drafts?userId=${req.session.user?.id}`);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

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
              file: JSON.stringify(initialDocData),
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
      const enrollment = await prismaClient.courseEnrollment.findFirst({
        where: {
          user_id: req.session.user?.id,
          course_id: courseName,
        },
        select: { id: true },
      });

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
                    enrollment: {
                      connect: {
                        id: enrollment?.id,
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
    console.log(err);

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
      const deleted = await prismaClient.assignment.delete({
        where: {
          id: deletedData.assignment_id!,
        },
        include: {
          members: {
            include: {
              submits: true,
            },
          },
        },
      });

      if (deleted.files.length) {
        deleted.files.forEach((file: any) => {
          console.log(file);

          unlinkSync(path.join(__dirname + `../../../files/${file}`));
        });
      }

      if (deleted.members) {
        deleted.members.forEach((mmbr) => {
          mmbr.submits.forEach((submit) => {
            submit.attachments.forEach((att) => {});
          });
        });
      }
    }

    deleteCache(`course?edit:${req.params.name}`);

    return res.status(200).send(deletedData.id);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get(`/explore/:alg`, async (_req, res) => {
  try {
    const courses = await prismaClient.course.findMany({
      where: {
        published: true,
      },
      include: {
        dataModels: {
          select: {
            type: true,
          },
        },
      },
    });

    return res.status(200).send(courses);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get(`/:name`, async (req, res) => {
  try {
    const course = await prismaClient.course.findFirst({
      where: {
        name: req.params.name,
      },
      include: {
        dataModels: {
          select: {
            type: true,
          },
        },
        ExtendedDetails: {
          select: {
            images: true,
            description: true,
            sponsors: true,
            reviews: true,
          },
        },
      },
    });

    return res.status(200).send(course);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get("/mycourse/:name", isAuth, async (req, res) => {
  try {
    const course = await prismaClient.courseEnrollment.findFirst({
      where: {
        course_id: req.params.name,
        user_id: req.session.user?.id,
      },
      include: {
        course: {
          include: {
            dataModels: {
              where: {
                AND: [
                  {
                    props: {
                      path: ["week"],
                      equals: 0,
                    },
                  },
                  {
                    props: {
                      path: ["day"],
                      equals: 0,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    return res.status(200).send(course);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.post("/files/:course", isAuth, async (req, res) => {
  try {
    const files = await prismaClient.courseDataModel.findMany({
      where: {
        course_id: req.params.course,
        AND: [
          {
            props: {
              path: ["week"],
              equals: parseInt(req.body.week),
            },
          },
          {
            props: {
              path: ["day"],
              equals: parseInt(req.body.day),
            },
          },
        ],
      },
    });

    return res.status(200).send(files);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.delete("/leave/:course", isAuth, async (req, res) => {
  try {
    const submits = await prismaClient.assignmentSubmits.findMany({
      where: {
        AssignmentsOnUsers: {
          enrollment: {
            user_id: req.session.user?.id,
            course_id: req.params.course,
          },
        },
      },
    });

    await deleteAttachments(submits);

    await prismaClient.courseEnrollment.deleteMany({
      where: {
        user_id: req.session.user?.id,
        course_id: req.params.course,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get("/progression/:coursename", isAuth, async (req, res) => {
  try {
    const enrollmet = await prismaClient.courseEnrollment.findFirst({
      where: {
        user_id: req.session.user?.id,
        course_id: req.params.coursename,
        role: "STUDENT",
      },
      include: {
        course: {
          select: {
            weeks: true,
          },
        },
      },
    });

    let progression = 0;

    function isWhatPercentOf(numA: number, numB: number) {
      return (numA / numB) * 100;
    }

    const startingDate = new Date(enrollmet?.startingAt!);
    const finishDate = new Date(startingDate);
    finishDate.setDate(finishDate.getDate() + enrollmet?.course.weeks! * 7);

    const today = new Date();
    const difference = Math.ceil(
      (finishDate.getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (difference > 0)
      progression = isWhatPercentOf(enrollmet?.course.weeks!, difference);
    else progression = 100;

    return res.status(200).json(progression);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

router.get("/today/:coursename", isAuth, async (req, res) => {
  try {
    const enrollmet = await prismaClient.courseEnrollment.findFirst({
      where: {
        user_id: req.session.user?.id,
        course_id: req.params.coursename,
        role: "STUDENT",
      },
      include: {
        course: {
          select: {
            weeks: true,
          },
        },
      },
    });

    const startingDate = new Date(enrollmet?.startingAt!);

    const today = new Date();
    const difference = Math.ceil(
      (new Date(today).getTime() - startingDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const todo = await prismaClient.courseDataModel.findMany({
      where: {
        course_id: req.params.coursename,
        AND: [
          {
            props: {
              path: ["day"],
              equals: (difference % 7) - 1,
            },
          },
          {
            props: {
              path: ["week"],
              equals: Math.floor(difference / 7),
            },
          },
        ],
      },
    });

    return res.status(200).send(todo);
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

export default router;
