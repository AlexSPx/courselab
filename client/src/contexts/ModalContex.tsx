import React, { createContext, ReactNode, useContext, useState } from "react";
import { ModalsInterface } from "../interfaces";

export const ModalContext = createContext<ModalsInterface | null>(null);

export const ModalContextProvider: React.FC = ({ children }) => {
  const [modals, setModals] = useState<JSX.Element[]>([]);

  return (
    <ModalContext.Provider
      value={{
        modals,
        setModals,
      }}
    >
      {modals}
      {children}
    </ModalContext.Provider>
  );
};
