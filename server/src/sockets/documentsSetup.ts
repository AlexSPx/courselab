import { Socket } from "socket.io";
import { prismaClient } from "..";
import { OnlineUser } from "../functions/online";
import { joinDoc, getAllInDoc, leaveDoc } from "../functions/redisCaching";

export function DocumentSocket(socket: Socket) {
  socket.on("join-document", async ({ docId }: { docId: string }) => {
    socket.join(docId);
    await joinDoc(
      docId,
      socket.handshake.sessionID!,
      socket.handshake.session?.user as OnlineUser
    );
    const allInDoc = await getAllInDoc(docId);

    socket.nsp.to(docId).emit("doc-users", { users: allInDoc });
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
