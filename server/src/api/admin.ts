import { Router } from "express";
import { prismaClient } from "../";

const router = Router();

router.get("/count", async (_req, res) => {
  try {
    const users = await prismaClient.user.count();
    const courses = await prismaClient.course.count({
      where: {
        published: true,
      },
    });

    return res.status(200).json({ users, courses });
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

router.get("/accounts", async (_req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      where: {
        isAdmin: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        first_name: true,
        last_name: true,
        socials: true,
        isActive: true,
        isVerified: true,
        isAdmin: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

router.post("/query", async (req, res) => {
  try {
    const result = await prismaClient.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: req.body.query.toLowerCase(),
            },
          },
          {
            email: {
              contains: req.body.query.toLowerCase(),
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        email: true,
        isActive: true,
        isVerified: true,
        isAdmin: true,
        socials: true,
      },
    });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

router.post("/save/user/:username", async (req, res) => {
  try {
    await prismaClient.user.update({
      where: {
        username: req.params.username,
      },
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        isActive: req.body.isActive,
        isAdmin: req.body.isAdmin,
        isVerified: req.body.isVerified,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json("Something went wrong");
  }
});

export default router;
