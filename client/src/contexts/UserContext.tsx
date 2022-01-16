import React, { createContext } from "react";
import { UserContextInterface, UserDataInterface } from "../interfaces";

export const UserContext = createContext<UserContextInterface | null>(null);

const UserCtxProvider: React.FC = ({ children }) => {
  const [userData, setUserData] = React.useState<UserDataInterface | any>(null);

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
