import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";
import { UserDataInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";

export default function useUser() {
  const [data, setData] = useState<UserDataInterface>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userCtx = useContext(UserContext);
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get<UserDataInterface>(
          `${baseurl}/user/auth`,
          {
            withCredentials: true,
          }
        );

        userCtx.setUserData!(data);
        setData(data);

        if (data.isAuth) {
          if (!socket?.connected) socket?.connect();
          socket?.emit("conn", { user: data.user });
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setData({ isAuth: false, user: null });
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading };
}
