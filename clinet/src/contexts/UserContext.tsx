import React, { createContext, useEffect } from "react";
import { UserDataInterface } from "../interfaces";

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
