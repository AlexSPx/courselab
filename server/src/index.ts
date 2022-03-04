import { PrismaClient } from "@prisma/client";
import express from "express";
import expressSession, { Session, SessionData } from "express-session";
import { createServer } from "http";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cors from "cors";
import bodyParser from "body-parser";

import user from "./api/user";
import course from "./api/course";
import document, { DocumentSocket } from "./api/document";
import video from "./api/video";
import assignment from "./api/assignment";
import quiz from "./api/quiz";

import path from "path";
import sharp from "sharp";
import { Server, Socket } from "socket.io";
import sharedsession from "express-socket.io-session";
import { addUser, leaveDoc, removeUser } from "./functions/redisCaching";
import { OnlineUser } from "./functions/online";

import resizingMiddleware from "./middlewares/resizeMiddleware";

require("dotenv").config();

export const prismaClient = new PrismaClient({
  log: ["error", "info", "warn"],
});

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://course-lab.xyz"],
    credentials: true,
  },
});
(async () => {
  const PORT = process.env.PORT;

  sharp.cache(false);

  const sessionMiddleware = expressSession({
    cookie: {
      maxAge: 60 * 60 * 1000 * 12, // ms
      httpOnly: true,
    },
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prismaClient, {
      logger: console,
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  });

  app.use(sessionMiddleware);

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));

  // Sockets
  io.use(sharedsession(sessionMiddleware, { autoSave: true }));

  io.on("connect", (socket: Socket) => {
    socket.on("conn", async ({ user }: { user: OnlineUser }) => {
      if (!socket.handshake.session?.user?.connections?.includes(socket.id)) {
        socket.handshake.session?.user?.connections?.push(socket.id);
        socket.handshake.session?.save();
      }
      await addUser(socket.handshake.sessionID!, user);
    });

    // docs
    DocumentSocket(socket);

    const rooms = io.sockets.adapter.socketRooms(socket.id);
    socket.on("disconnect", async () => {
      try {
        // Disconect from all rooms
        if (rooms && socket.handshake.sessionID && socket.handshake.session) {
          await leaveDoc(Array.from(rooms), socket.handshake.sessionID);
          socket.to(Array.from(rooms)).emit("leave-document", {
            whoLeft: socket.handshake.session.user,
          });
        }

        // Make offline
        if (socket.handshake.session?.user?.connections) {
          const updateConnections =
            socket.handshake.session.user.connections.filter(
              (conn) => conn !== socket.id
            );
          socket.handshake.session.user.connections = updateConnections;

          socket.handshake.session.save();

          if (socket.handshake.session.user.connections.length === 0)
            await removeUser(socket.handshake.sessionID!);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  // routes
  app.use("/api/user", user);
  app.use("/api/course", course);
  app.use("/api/doc", document);
  app.use("/api/video", video);
  app.use("/api/assignment", assignment);
  app.use("/api/quiz", quiz);

  // static
  app.use(
    "/api/user/avatars",
    express.static(path.join(__dirname, "../images/avatars"))
  );

  app.use(
    "/api/course/logo",
    express.static(path.join(__dirname, "../images/courseImage"))
  );

  app.use(
    "/api/course/images",
    express.static(path.join(__dirname, "../images/courses"))
  );

  app.use("/(*_\\d+x\\d+.(jpe?g|png))", resizingMiddleware);

  httpServer.listen(PORT, () => console.log(`running on port ${PORT}`));
})();

declare module "express-session" {
  export interface SessionData {
    user: {
      id: string;
      username: string;
      first_name: string | null;
      last_name: string | null;
      email: string;
      connections?: string[];
    };
  }
}

declare module "socket.io/dist/socket" {
  interface Handshake {
    session?: Session & Partial<SessionData>;
    sessionID?: string;
  }
}
