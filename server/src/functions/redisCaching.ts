import { createClient } from "redis";
import { OnlineUser } from "./online";
import Redis from "ioredis";

const DEFAULT_EXPIRATION = 3600;

const redisClient = new Redis();

export default redisClient;

export function getOrSetCache(key: string, cb: Function) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await redisClient.get(key);
      console.log(data);

      if (data) return resolve(JSON.parse(data));

      const newData = await cb();
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(newData));
      resolve(newData);
    } catch (error) {
      reject(error);
    }
  });
}

export async function deleteCache(key: string) {
  await redisClient.del(key);
}

const ONLINE_USERS = "online_users";

export async function addUser(sessionId: string, user: OnlineUser) {
  const check = await redisClient.hexists(ONLINE_USERS, sessionId);
  if (!check && user) {
    redisClient.hset(ONLINE_USERS, sessionId, JSON.stringify(user));
  }
}

export async function removeUser(sessionId: string) {
  await redisClient.hdel(ONLINE_USERS, sessionId);
}

export async function getAllOnline(members: string[]) {
  const whoIsOnline: OnlineUser[] = [];

  const all = await redisClient.hvals(ONLINE_USERS);

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
  const check = await redisClient.hexists(`${DOCUMENT}:${docId}`, sessionId);
  if (!check && user) {
    await redisClient.hset(
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
    const whoLeft = await redisClient.hget(
      `${DOCUMENT}:${docId[0]}`,
      sessionId
    );

    docId.forEach(async (id) => {
      await redisClient.hdel(`${DOCUMENT}:${id}`, sessionId);
    });

    return whoLeft;
  } else {
    const whoLeft = await redisClient.hget(`${DOCUMENT}:${docId}`, sessionId);
    await redisClient.hdel(`${DOCUMENT}:${docId}`, sessionId);

    return whoLeft;
  }
}

export async function getAllInDoc(docId: string) {
  const parsedOnline = new Array();
  const online = await redisClient.hvals(`${DOCUMENT}:${docId}`);

  online.forEach((mmbr) => parsedOnline.push(JSON.parse(mmbr)));
  return parsedOnline;
}
