import { createClient } from "redis";
import { OnlineUser } from "./online";

const DEFAULT_EXPIRATION = 3600;

const redisClient = createClient();
redisClient.connect();

redisClient.on("error", (err) => console.log("Redis Client Error" + err));

export function getOrSetCache(key: string, cb: Function) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await redisClient.get(key);
      if (data !== null) return resolve(JSON.parse(data));

      const newData = await cb();
      redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(newData));
      resolve(newData);
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteCache(key: string) {
  await redisClient.DEL(key);
}

const ONLINE_USERS = "online_users";

export async function addUser(sessionId: string, user: OnlineUser) {
  const check = await redisClient.HEXISTS(ONLINE_USERS, sessionId);
  if (!check && user) {
    redisClient.HSET(ONLINE_USERS, sessionId, JSON.stringify(user));
  }
}

export async function removeUser(sessionId: string) {
  await redisClient.HDEL(ONLINE_USERS, sessionId);
}

export async function getAllOnline(members: string[]) {
  const whoIsOnline: OnlineUser[] = [];

  const all = await redisClient.HVALS(ONLINE_USERS);

  all.forEach((onmember) => {
    const paresedMember = JSON.parse(onmember);
    for (const [key, value] of Object.entries(paresedMember)) {
      if (key === "id") {
        try {
          if (members.includes(value as string)) {
            whoIsOnline.push(paresedMember);
          }
        } catch (err) {
          continue;
        }
      }
    }
  });
  return whoIsOnline;
}

const DOCUMENT = "document";

export async function joinDoc(
  docId: string,
  sessionId: string,
  user: OnlineUser
) {
  const check = await redisClient.HEXISTS(`${DOCUMENT}:${docId}`, sessionId);
  if (!check && user) {
    await redisClient.HSET(
      `${DOCUMENT}:${docId}`,
      sessionId,
      JSON.stringify(user)
    );
  }
}

export async function leaveDoc(
  docId: string | Array<string>,
  sessionId: string
) {
  if (docId instanceof Array) {
    const whoLeft = await redisClient.HGET(
      `${DOCUMENT}:${docId[0]}`,
      sessionId
    );

    docId.forEach(async (id) => {
      await redisClient.HDEL(`${DOCUMENT}:${id}`, sessionId);
    });

    return whoLeft;
  } else {
    const whoLeft = await redisClient.HGET(`${DOCUMENT}:${docId}`, sessionId);
    await redisClient.HDEL(`${DOCUMENT}:${docId}`, sessionId);

    return whoLeft;
  }
}

export async function getAllInDoc(docId: string) {
  const parsedOnline = new Array();
  const online = await redisClient.HVALS(`${DOCUMENT}:${docId}`);
  online.forEach((mmbr) => parsedOnline.push(JSON.parse(mmbr)));
  return parsedOnline;
}
