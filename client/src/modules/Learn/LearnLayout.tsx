import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useHasImage from "../../Hooks/useHasImage";
import SideBar, { SideBarHref } from "../Layouts/SideBar";

type LearnLayout = {
  weeks: number;
  name: string;
  public_name: string;
};

export const LearnLayout: React.FC<LearnLayout> = ({
  children,
  weeks,
  name,
  public_name,
}) => {
  const { url } = useHasImage(name, { type: "course_logo" });

  const router = useRouter();

  useEffect(() => {
    if (!router.query.week)
      router.push({ pathname: router.pathname, query: { name, week: 0 } });
  }, [name, router]);

  const buttons = [...Array(weeks)].map((x, index) => {
    return (
      <SideBarHref
        key={index}
        label={`week - ${index + 1}`}
        href={{ pathname: router.pathname, query: { name, week: index } }}
      />
    );
  });

  return (
    <div
      className="flex flex-row w-full h-full overflow-auto bg-gray-50"
      id="journal-scroll"
    >
      <SideBar css="bg-white">
        <div className="relative w-24 h-24 rounded-lg shadow mt-4">
          <Image
            src={url}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            alt=""
          />
        </div>
        <span className="font-semibold my-2">{public_name}</span>

        {buttons}
        {/* <SideBarSection label={"Something"} /> */}
      </SideBar>
      <div
        className="flex flex-col w-full h-full items-center overflow-auto"
        id="journal-scroll"
      >
        {children}
      </div>
    </div>
  );
};
