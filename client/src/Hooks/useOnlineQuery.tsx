import axios from "axios";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { GeneralUserInformation } from "../interfaces";
import { baseurl } from "../lib/fetcher";

export default function useOnlineQuery(ids: string[], mseconds: number) {
  const [onlineUsers, setOnlineUsers] = useState<GeneralUserInformation[]>([]);

  useEffect(() => {
    const fetchOnline = async () => {
      const users = await axios.post(
        `${baseurl}/user/online`,
        { ids },
        {
          withCredentials: true,
        }
      );

      if (!isEqual(onlineUsers, users.data)) {
        setOnlineUsers(users.data);
      }
    };

    fetchOnline();
    const interval = setInterval(() => fetchOnline(), mseconds);
    return () => clearInterval(interval);
  }, [ids, mseconds, onlineUsers]);

  return { onlineUsers };
}
