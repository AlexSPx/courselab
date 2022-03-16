import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { addUser, getAllOnline, removeUser } from "../functions/redisCaching";

export default function setUpSocketServer(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  io.use(async (socket, next) => {
    const sessionID = socket.handshake.sessionID;
    if (sessionID) {
      const session = socket.handshake.session;
      if (session && socket.handshake.session?.user?.connections) {
        const connections = session.user?.connections;
        if (connections?.includes(session.id)) {
          console.log("session already exists");
          next();
        } else {
          socket.handshake.session.user.connections.push(socket.id);
          socket.handshake.session.save();

          if (socket.handshake.session.user.connections.length > 0) {
            console.log("adding");
            const user = socket.handshake.session.user;
            await addUser(sessionID, {
              id: user.id,
              username: user.username,
              first_name: user.first_name!,
              last_name: user.last_name!,
              email: user.email,
              isAdmin: user.isAdmin!,
              connections: user.connections!,
            });
          }
          next();
        }
      }
    }
  });

  io.on("connect", (socket: Socket) => {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    socket.on("disconnect", async () => {
      try {
        socket.emit("online-users", { users: await getAllOnline("all") });

        const sessionID = socket.handshake.sessionID;
        if (sessionID) {
          removeUser(sessionID);
          if (socket.handshake.session?.user?.connections) {
            const updated = socket.handshake.session.user.connections.filter(
              (socketId) => socketId !== socket.id
            );
            socket.handshake.session.user.connections = updated;
            socket.handshake.session.save();
            console.log("session removed");
            if (updated.length === 0) {
              socket.broadcast.emit("user_disconnected", {
                username: socket.handshake.session.user.username,
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}
