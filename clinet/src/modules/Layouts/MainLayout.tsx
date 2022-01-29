import { CSSProperties } from "react";

interface LayoutProps {
  css?: string;
}

export const MainLayout: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row w-full h-full justify-center ${css}`}
      id="journal-scroll"
    >
      {children}
    </div>
  );
};

export const Left: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`order-1 justify-center sm:order-none w-auto h-14 sm:h-full sm:flex lg:w-1/4 sm:flex-grow p-1 ${css}`}
    >
      {children}
    </div>
  );
};

export const Main: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`order-3 sm:order-none flex w-full h-full sm:w-4/5 lg:w-1/2 p-1 flex-col ${css}`}
    >
      {children}
    </div>
  );
};

export const Right: React.FC<LayoutProps> = ({ children, css }) => {
  return (
    <div
      className={`order-2 justify-center sm:order-none w-auto h-14 sm:h-full sm:flex lg:w-1/4 sm:flex-grow p-1 ${css}`}
    >
      {children}
    </div>
  );
};
