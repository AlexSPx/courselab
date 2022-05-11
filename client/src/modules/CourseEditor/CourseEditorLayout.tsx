import axios from "axios";
import { IoIosLaptop } from "react-icons/io";
import { mutate } from "swr";
import { baseurl } from "../../lib/fetcher";
import { SettingsIcon, StructureIcon } from "../../svg/small";
import SideBar, {
  SideBarSection,
  SideBarHref,
  SideBarButton,
} from "../Layouts/SideBar";
import useRequst from "../../lib/useRequest";
import { AiOutlineContacts, AiOutlineMenuUnfold } from "react-icons/ai";
import { TFunction } from "react-i18next";

type SideBarMenuProps = {
  name: string;
  published: boolean;
  t: TFunction<"course_settings", undefined>;
};

export const CourseEditorLayout: React.FC<SideBarMenuProps> = ({
  children,
  name,
  published,
  t,
}) => {
  const { executeQuery } = useRequst();

  const path = `/course/edit/${name}`;

  const handlePublish = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/publish`,
          { name },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Publishing",
        successTitle: "Published",
        onSuccess: () => mutate(`${baseurl}/course/fetchadmin/${name}`),
      }
    );
  };

  const handleUnlist = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/unlist`,
          { name },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Unlisting",
        successTitle: "Unlisted",
        onSuccess: () => mutate(`${baseurl}/course/fetchadmin/${name}`),
      }
    );
  };

  return (
    <div
      className="flex flex-row relative w-full h-full overflow-auto bg-gray-50"
      id="journal-scroll"
    >
      <SideBar css="bg-white">
        <SideBarSection label="Settings" />
        <SideBarHref
          label={t("nav-general")}
          icon={<SettingsIcon />}
          href={`${path}/general`}
        />
        <SideBarHref
          label={t("nav-structure")}
          icon={<StructureIcon />}
          href={`${path}/structure`}
        />
        <SideBarHref
          label={t("nav-landing")}
          icon={<IoIosLaptop size={31} />}
          href={`${path}/landing`}
        />
        <SideBarHref
          label={t("nav-attendance")}
          icon={<AiOutlineContacts size={31} />}
          href={`${path}/attendance`}
        />
        {published ? (
          <SideBarButton
            label={t("nav-unlist")}
            aria-label="unlist"
            func={handleUnlist}
          />
        ) : (
          <SideBarButton
            label={t("nav-publish")}
            aria-label="publish"
            func={handlePublish}
          />
        )}
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
