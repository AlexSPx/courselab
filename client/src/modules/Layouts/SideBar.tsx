import Link from "next/link";
import { useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

type CssProp = {
  css?: string;
};

const SideBar: React.FC<CssProp> = ({ children, css }) => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const MobileMenu = () => {
    return (
      <div
        className="absolute md:hidden my-2 z-[60] left-0 mx-1 cursor-pointer bg-white border"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? (
          <AiOutlineMenuUnfold size={38} />
        ) : (
          <AiOutlineMenuFold size={38} />
        )}
      </div>
    );
  };

  return (
    <>
      <MobileMenu />
      <div
        className={`absolute flex flex-col ${
          !mobileMenu && "hidden"
        } z-50 w-56 h-full pt-8 md:flex md:sticky md:pt-0 items-center md:w-72 border-r top-0 left-0 ${css}`}
      >
        {children}
      </div>
    </>
  );
};

export const SideBarHref = ({
  label,
  icon,
  href,
}: {
  label?: string;
  icon?: JSX.Element;
  href: string | any;
}) => {
  return (
    <Link href={href}>
      <a className="w-5/6 btn btn-outline btn-sm rounded-btn my-1 justify-center h-auto px-2">
        {icon}
        {label}
      </a>
    </Link>
  );
};

export const SideBarButton = ({
  label,
  icon,
  func,
}: {
  label: string;
  icon?: JSX.Element;
  func: () => void;
}) => {
  return (
    <button
      className="w-5/6 btn btn-outline btn-sm rounded-btn my-1 justify-center"
      onClick={func}
      aria-label={label}
    >
      <div className="mx-1">{icon}</div>
      {label}
    </button>
  );
};

export const SideBarSection = ({ label }: { label?: string }) => {
  return (
    <div className="divider w-5/6 mb-4 font-semibold text-lg">
      <p className="text-xl">{label}</p>
    </div>
  );
};

export default SideBar;
