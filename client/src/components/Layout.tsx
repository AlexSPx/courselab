import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import AuthHeader from "../modules/Layouts/AuthHeaders";
import Header from "./Header";

export default function Layout({ children }: LayoutProps) {
  const { userData } = useContext(UserContext);

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        {userData?.isAuth ? <AuthHeader /> : <Header />}
        {/* <div className="overflow-auto">{children}</div> */}
        {children}
      </div>
    </>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}
