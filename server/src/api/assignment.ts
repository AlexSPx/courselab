import { Router } from "express";
import { deleteCache } from "../functions/redisCaching";
import { prismaClient } from "../";
import { isAuth } from "../middlewares/auth";

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
            },
            role: "ADMIN" || "EDITOR",
          },
        },
      },
    });

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
        content: req.body.content,
      },
    });
    console.log(assignment);

    if (assignment.count === 0) return res.status(400).send("No permissions");

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});

export default router;
