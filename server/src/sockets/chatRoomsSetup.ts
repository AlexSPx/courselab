import { Socket } from "socket.io";
import { prismaClient } from "..";

export default function chatRoomSetup(socket: Socket) {
  socket.on("chatroom-join", ({ chatroomId }: { chatroomId: string }) => {
    socket.join(chatroomId);
  });

  socket.on(
    "message-send",
    async ({
      chatroomId,
      text,
      senderId,
    }: {
      chatroomId: string;
      text: string;
      senderId: string;
    }) => {
      const message = await prismaClient.message.create({
        data: {
          sender: {
            connect: {
              id: senderId,
            },
          },
          chatRoom: {
            connect: {
              id: chatroomId,
            },
          },
          text,
        },
      });

      socket.nsp.to(chatroomId).emit(`chatroom-message`, message);
    }
  );

  socket.on("start-typing", ({ chatroomId, username }) => {
    socket.to(chatroomId).emit(`start-typing`, username);
  });
  socket.on("stop-typing", ({ chatroomId, username }) => {
    socket.to(chatroomId).emit(`stop-typing`, username);
  });
}
