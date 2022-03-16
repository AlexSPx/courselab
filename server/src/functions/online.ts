const OnlineMap = new Map();

export interface OnlineUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  isAdmin: boolean;
  connections: string[];
}

export const addUser = (sessionId: string, user: any) => {
  if (!OnlineMap.has(sessionId) && user) {
    OnlineMap.set(sessionId, user);
  }
};

export const removeUser = (sessionId: string) => {
  OnlineMap.delete(sessionId);
};

export const getAllOnline = (members: string[]) => {
  const whoIsOnline = new Array();

  OnlineMap.forEach((onmember) => {
    for (const [key, value] of Object.entries(onmember)) {
      if (key === "id") {
        try {
          if (members.includes(value as string)) {
            whoIsOnline.push(onmember);
          }
        } catch (err) {
          continue;
        }
      }
    }
  });
  return whoIsOnline;
};
