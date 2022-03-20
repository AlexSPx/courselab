import { PrismaClient } from "@prisma/client";
import express from "express";
import expressSession, { Session, SessionData } from "express-session";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";

import user from "./api/user";
import course from "./api/course";
import document from "./api/document";
import video from "./api/video";
import assignment from "./api/assignment";
import quiz from "./api/quiz";
import chatroom from "./api/chatrooms";

import path from "path";
import sharp from "sharp";
import { Server } from "socket.io";
import sharedsession from "express-socket.io-session";
import redisClient from "./functions/redisCaching";

import resizingMiddleware from "./middlewares/resizeMiddleware";
import compression from "compression";
import helmet from "helmet";
import { debug } from "console";
import setUpSocketServer from "./sockets/setup";
import { baseDir } from "./settings/multer";

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

  debug("env level: " + process.env.NODE_ENV);

  const RedisStore = connectRedis(expressSession);

  const sessionMiddleware = expressSession({
    cookie: {
      maxAge: 60 * 60 * 1000 * 12, // ms
      httpOnly: true,
    },
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
  });

  app.use(sessionMiddleware);
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(compression());
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  // Sockets
  io.use(sharedsession(sessionMiddleware, { autoSave: true }));

  setUpSocketServer(io);

  // routes
  app.use("/api/user", user);
  app.use("/api/course", course);
  app.use("/api/doc", document);
  app.use("/api/video", video);
  app.use("/api/assignment", assignment);
  app.use("/api/quiz", quiz);
  app.use("/api/chatroom", chatroom);

  // static
  app.use(
    "/api/user/avatars",
    express.static(path.join(baseDir, "images/avatars"))
  );

  app.use(
    "/api/course/logo",
    express.static(path.join(baseDir, "images/courseImage"))
  );

  app.use(
    "/api/course/images",
    express.static(path.join(baseDir, "images/courses"))
  );

  app.use("/(*_\\d+x\\d+.(jpe?g|png))", resizingMiddleware);

  httpServer.listen(PORT, () => debug(`running on port ${PORT}`));
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
      isAdmin: boolean;
      isVerified: boolean;
      isActive: boolean;
    };
  }
}

declare module "socket.io/dist/socket" {
  interface Handshake {
    session?: Session & Partial<SessionData>;
    sessionID?: string;
  }
}
