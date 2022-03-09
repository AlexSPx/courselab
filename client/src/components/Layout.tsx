import AuthHeader from "../modules/Layouts/AuthHeaders";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  isAuth: boolean;
}

export default function Layout({ children, isAuth }: LayoutProps) {
  return (
    <>
      <main className="flex flex-col w-screen h-screen overflow-auto">
        {isAuth ? <AuthHeader /> : <Header />}
        {children}
      </main>
    </>
  );
}
