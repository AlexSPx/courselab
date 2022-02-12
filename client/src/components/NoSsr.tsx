import dynamic from "next/dynamic";
import { Fragment } from "react";

const NoSsr: React.FC = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default dynamic(() => Promise.resolve(NoSsr), { ssr: false });
