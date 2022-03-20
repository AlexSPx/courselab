import { Router } from "express";
import { prismaClient } from "..";
import { isAuth } from "../middlewares/auth";
const router = Router();

router.get(`/search/:query`, isAuth, async (req, res) => {
  try {
    if (req.params.query.charAt(0) === "@") {
      const query = req.params.query.replace("@", "");
      const users = await prismaClient.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: query,
              },
            },
            {
              first_name: {
                contains: query,
              },
            },
            {
              last_name: {
                contains: query,
              },
            },
          ],
        },
      });
      return res.status(200).send(users);
    }

    return res.status(200).send(null);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get(`/rooms`, isAuth, async (req, res) => {
  try {
    const rooms = await prismaClient.chatRoom.findMany({
      where: {
        members: {
          some: {
            user_id: req.session.user?.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).send(rooms);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/:type/:query", isAuth, async (req, res) => {
  try {
    if (req.params.type === "direct") {
      const room = await prismaClient.chatRoom.findFirst({
        where: {
          AND: [
            {
              members: {
                some: {
                  user_id: req.session.user?.id,
                },
              },
            },
            {
              members: {
                some: {
                  user: {
                    username: req.params.query,
                  },
                },
              },
            },
          ],
          type: "DIRECT",
        },
        include: {
          members: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  first_name: true,
                  last_name: true,
                },
              },
              role: true,
            },
          },
          messages: {
            take: 20,
            orderBy: {
              id: "desc",
            },
          },
        },
      });

      const lastMessageResult = room?.messages[room?.messages.length - 1];
      const messagesCursor = lastMessageResult?.id;

      const user = await prismaClient.user.findFirst({
        where: {
          username: req.params.query,
        },
        select: {
          id: true,
          username: true,
          first_name: true,
          last_name: true,
          email: true,
          isAdmin: true,
        },
      });

      return res.status(200).json({
        room: room
          ? Object.assign(
              room,
              { messagesCursor },
              { messages: room?.messages.reverse() }
            )
          : null,
        user,
      });
    }
    return res.sendStatus(400);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/direct", isAuth, async (req, res) => {
  try {
    await prismaClient.chatRoom.create({
      data: {
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
            {
              user: {
                connect: {
                  id: req.body.id,
                },
              },
              role: "ADMIN",
            },
          ],
        },
        type: "DIRECT",
      },
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get("/messages/:room_id/:cursor", isAuth, async (req, res) => {
  try {
    const messages = await prismaClient.message.findMany({
      take: 20,
      skip: 1,
      cursor: {
        id: parseInt(req.params.cursor),
      },
      where: {
        room_id: req.params.room_id,
      },
      orderBy: {
        id: "desc",
      },
    });

    const lastMessageResult = messages[19];
    const messagesCursor = lastMessageResult?.id;
    return res
      .status(200)
      .json({ messages: messages.reverse(), cursor: messagesCursor });
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
