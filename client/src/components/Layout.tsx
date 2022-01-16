import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Header from "./Header";

export default function Layout({ children }: LayoutProps) {
  const userCtx = useContext(UserContext);

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        {userCtx?.userData?.isAuth ? null : <Header />}
        {/* <div className="overflow-auto">{children}</div> */}
        {children}
      </div>
    </>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}
