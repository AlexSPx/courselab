import { Router } from "express";
import { Socket } from "socket.io";
import { OnlineUser } from "../functions/online";
import { getAllInDoc, joinDoc, leaveDoc } from "../functions/redisCaching";
import { io, prismaClient } from "../";
import { isAuth } from "../middlewares/auth";

const router = Router();

export const initialDocData = `{ ops: [{ insert: "\n" }] }`;

export function DocumentSocket(socket: Socket) {
  socket.on("join-document", async ({ docId }: { docId: string }) => {
    await joinDoc(
      docId,
      socket.handshake.sessionID!,
      socket.handshake.session?.user as OnlineUser
    );

    socket.join(docId);

    io.to(docId).emit("doc-users", { users: await getAllInDoc(docId) });
  });

  socket.on("leave-document", async ({ docId }: { docId: string }) => {
    socket.leave(docId);
    const whoLeft = await leaveDoc(docId, socket.handshake.sessionID!);
    socket.to(docId).emit("leave-document", { whoLeft });
  });

  socket.on("docs-change", (data: { delta: any; id: string }) => {
    socket.to(data.id).emit(`remote-change`, data.delta);
  });

  socket.on(
    "cursor-change",
    ({ docId, range, id }: { docId: string; range: any; id: string }) => {
      socket.to(docId).emit("cursor-select", { id, range });
    }
  );

  socket.on(
    "save-document",
    async ({ file, id }: { file: any; id: string }) => {
      await prismaClient.document.update({
        where: { id },
        data: {
          file,
        },
      });
    }
  );
}

router.get("/:id", isAuth, async (req, res) => {
  try {
    const document = await prismaClient.document.findFirst({
      where: {
        id: req.params.id,
        OR: [
          {
            members: {
              some: {
                user_id: req.session.user?.id,
              },
            },
          },
          {
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
        ],
      },
      select: {
        id: true,
        name: true,
        file: true,
        members: {
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
            role: true,
            AssignedAt: true,
          },
        },
        courseDataModel: {
          select: {
            course: {
              select: {
                name: true,
                members: {
                  select: {
                    id: true,
                    role: true,
                    user: {
                      select: {
                        id: true,
                        username: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                      },
                    },
                    course_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(document);

    return res.status(200).send(document);
  } catch (error) {
    console.log(error);

    return res.status(400).send("Someting went wrong");
  }
});

router.post("/adduser", isAuth, async (req, res) => {
  try {
    await prismaClient.document.update({
      where: {
        id: req.body.docId,
      },
      data: {
        members: {
          create: {
            user: {
              connect: {
                id: req.body.userId,
              },
            },
            role: req.body.role,
          },
        },
      },
    });

    return res.status(200).send("User added");
  } catch (error) {
    return res.status(400).send("Someting went wrong");
  }
});

export default router;
