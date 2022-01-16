import Link from "next/link";

type CssProp = {
  css?: string;
};

const SideBar: React.FC<CssProp> = ({ children, css }) => {
  return (
    <div
      className={`hidden md:flex flex-col items-center w-72 border-r sticky top-0 left-0 ${css}`}
    >
      {children}
    </div>
  );
};

export const SideBarButton = ({
  label,
  icon,
  href,
}: {
  label?: string;
  icon?: JSX.Element;
  href: string;
}) => {
  return (
    <Link href={href}>
      <a className="w-5/6 btn btn-outline btn-sm rounded-btn my-1 justify-center">
        <div className="mx-1">{icon}</div>
        {label}
      </a>
    </Link>
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
