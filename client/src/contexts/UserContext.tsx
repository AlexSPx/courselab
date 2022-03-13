import React, { createContext, useEffect } from "react";
import useSWR from "swr";
import { UserDataInterface } from "../interfaces";
import { baseurl } from "../lib/fetcher";

export const UserContext = createContext<UserProps>({
  userData: null,
  setUserData: null,
});

interface UserProps {
  userData: UserDataInterface | null;
  setUserData: React.Dispatch<
    React.SetStateAction<UserDataInterface | null>
  > | null;
}

interface UserProviderProps {
  user: UserDataInterface | null;
}

const UserCtxProvider: React.FC<UserProviderProps> = ({ children, user }) => {
  const [userData, setUserData] = React.useState<UserDataInterface | null>(
    user ? user : null
  );

  useSWR(`${baseurl}/user/auth`, { onSuccess: (data) => setUserData(data) });

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;
