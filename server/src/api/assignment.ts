import { Router } from "express";
import { deleteCache } from "../functions/redisCaching";
import { prismaClient } from "../";
import { isAuth } from "../middlewares/auth";
import { uploadFile } from "../settings/multer";
import { unlinkSync } from "fs";
import path from "path";
import { submitsDitribution } from "../functions/assignmentHelpers";

const router = Router();

router.get("/admin/:id", isAuth, async (req, res) => {
  try {
    const assignment = await prismaClient.assignment.findFirst({
      where: {
        id: req.params.id,
        members: {
          some: {
            enrollment: {
              user_id: req.session.user?.id,
              role: "ADMIN" || "TEACHER",
            },
          },
        },
      },
    });

    return res.status(200).send(assignment);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.get("/:id", isAuth, async (req, res) => {
  try {
    let assignment = await prismaClient.assignment.findFirst({
      where: {
        id: req.params.id,
        members: {
          some: {
            enrollment: {
              user_id: req.session.user?.id,
              role: "STUDENT",
            },
          },
        },
      },
      include: {
        members: {
          where: {
            assignment_id: req.params.id,
            enrollment: {
              user_id: req.session.user?.id,
            },
          },
          include: {
            submits: {
              orderBy: {
                dateOfSubmit: "asc",
              },
            },
            enrollment: {
              select: {
                startingAt: true,
              },
            },
          },
        },
        courseDataModel: {
          select: {
            props: true,
          },
        },
      },
    });

    if (assignment && assignment.daysToSubmit) {
      const submitDate = new Date(assignment.members[0].enrollment.startingAt);
      const props = assignment.courseDataModel!.props as {
        week: number;
        day: number;
        index: number;
      };
      submitDate.setDate(
        submitDate.getDate() +
          props.week * 7 +
          props.day +
          assignment.daysToSubmit
      );

      assignment = Object.assign(assignment, { submitDate: submitDate });
    }

    return res.status(200).send(assignment);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const deleted = await prismaClient.assignment.delete({
      where: {
        id: req.params.id,
      },
      include: {
        courseDataModel: {
          include: {
            course: true,
          },
        },
      },
    });

    if (deleted.courseDataModel)
      deleteCache(`course?edit:${deleted.courseDataModel.course.name}`);

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);

    return res.status(400).send("Something went wrong");
  }
});

router.post("/save", isAuth, async (req, res) => {
  try {
    const assignment = await prismaClient.assignment.updateMany({
      where: {
        id: req.body.assignmentId,
        members: {
          some: {
            enrollment: {
              user_id: req.session.user?.id,
            },
            role: "ADMIN" || "EDITOR",
          },
        },
      },
      data: {
        name: req.body.name,
        content: JSON.stringify(req.body.content),
        daysToSubmit: parseInt(req.body.daysToSubmit),
      },
    });

    if (assignment.count === 0) return res.status(400).send("No permissions");

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

router.post(
  "/file/upload",
  isAuth,
  uploadFile.array("files"),
  async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).send("No files");
      }
      const files = (req.files as Express.Multer.File[] | undefined)?.map(
        (f: Express.Multer.File) => f.filename
      );

      await prismaClient.assignment.update({
        where: {
          id: req.body.assigment_id,
        },
        data: {
          files: {
            push: files,
          },
        },
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something went wrong");
    }
  }
);

router.get("/download/:name", isAuth, async (req, res) => {
  try {
    const file = path.join(__dirname + `../../../files/${req.params.name}`);
    return res.download(file);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/submit", isAuth, uploadFile.array("files"), async (req, res) => {
  try {
    let attachments: {
      type: string;
      path?: string;
      link?: string;
      doc?: { type: "DOCUMENT" | "VIDEO"; name: string; id: string };
    }[] = [];
    (req.files as Express.Multer.File[] | undefined)?.map(
      (f: Express.Multer.File) =>
        attachments.push({ type: "FILE", path: f.filename })
    );
    req.body.links?.forEach((link: string) => {
      attachments.push({ type: "LINK", link });
    });

    req.body.docs?.forEach((doc: string) => {
      attachments.push({ type: "DOC", doc: JSON.parse(doc) });
    });

    if (Array.isArray(req.body.alreadyAttached)) {
      req.body.alreadyAttached.forEach((t: any) =>
        attachments.push(JSON.parse(t))
      );
    }
    if (typeof req.body.alreadyAttached === "string")
      attachments.push(req.body.alreadyAttached);

    const removeFunc = (tbr_string: string) => {
      const tbr: {
        type: "DOCUMENT" | "FILE" | "VIDEO" | "LINK";
        path: string;
      } = JSON.parse(tbr_string);

      if (tbr.type === "FILE") {
        attachments = attachments.filter((att) => att.path !== tbr.path);
        unlinkSync(path.join(__dirname + `../../../files/${tbr.path}`));
        return;
      }
    };

    if (Array.isArray(req.body.toBeRemoved)) {
      req.body.toBeRemoved.forEach((tbr_string: string) =>
        removeFunc(tbr_string)
      );
    }
    if (typeof req.body.toBeRemoved === "string")
      removeFunc(req.body.toBeRemoved);

    const submit = await prismaClient.assignmentSubmits.create({
      data: {
        AssignmentsOnUsers: {
          connect: {
            enrollment_id_assignment_id: {
              enrollment_id: req.body.enrollment_id,
              assignment_id: req.body.assignment_id,
            },
          },
        },
        attachments: attachments,
        dateOfSubmit: new Date(),
      },
    });

    return res.status(200).send(submit);
  } catch (error) {
    console.log(error);

    return res.status(400).send(JSON.stringify(error));
  }
});

router.get("/unsubmit/:id", isAuth, async (req, res) => {
  try {
    const updated = await prismaClient.assignmentSubmits.update({
      where: {
        id: req.params.id,
      },
      data: {
        dateOfRemoval: new Date(),
      },
    });

    return res.status(200).send(updated);
  } catch (error) {
    return res.status(400).send(JSON.stringify(error));
  }
});

router.post("/submits/count", isAuth, async (req, res) => {
  try {
    const all = await prismaClient.courseEnrollment.count({
      where: {
        course_id: req.body.course,
        startingAt: req.body.startingDate,
        role: "STUDENT",
      },
    });

    const submitted = await prismaClient.assignmentSubmits.findMany({
      where: {
        assignment_id: req.body.assignmentId,
        AssignmentsOnUsers: {
          enrollment: {
            course_id: req.body.course,
            startingAt: req.body.startingDate,
          },
        },
        dateOfRemoval: null,
      },
      distinct: ["enrollment_id"],
    });

    return res.status(200).send({ all, submitted: submitted.length });
  } catch (error) {
    return res.status(400).send(JSON.stringify(error));
  }
});

router.post("/submits/details", isAuth, async (req, res) => {
  try {
    const submits = await prismaClient.assignmentsOnUsers.findMany({
      where: {
        assignment_id: req.body.assignmentId,
        enrollment: {
          course_id: req.body.course,
          startingAt: req.body.startingDate,
        },
        role: "STUDENT",
      },
      include: {
        _count: {
          select: { submits: true },
        },
        submits: true,
        enrollment: {
          select: {
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
        },
      },
    });

    const { submitted, missing } = submitsDitribution(submits);
    return res.status(200).send({ submitted, missing });
  } catch (error) {
    return res.status(400).send(JSON.stringify(error));
  }
});

router.post("/return", isAuth, async (req, res) => {
  try {
    await prismaClient.assignmentSubmits.update({
      where: {
        id: req.body.id,
      },
      data: {
        returned: true,
        comment: req.body.comment,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send(JSON.stringify(error));
  }
});

export default router;
