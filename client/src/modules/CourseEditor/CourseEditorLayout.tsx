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
import { AiOutlineContacts } from "react-icons/ai";

type SideBarMenuProps = {
  name: string;
  published: boolean;
};

export const CourseEditorLayout: React.FC<SideBarMenuProps> = ({
  children,
  name,
  published,
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
      className="flex flex-row w-full h-full overflow-auto bg-gray-50"
      id="journal-scroll"
    >
      <SideBar css="bg-white">
        <SideBarSection label="Settings" />
        <SideBarHref
          label="General settings"
          icon={<SettingsIcon />}
          href={`${path}/general`}
        />
        <SideBarHref
          label="Course structure"
          icon={<StructureIcon />}
          href={`${path}/structure`}
        />
        <SideBarHref
          label="Course landing"
          icon={<IoIosLaptop size={31} />}
          href={`${path}/landing`}
        />
        <SideBarHref
          label="Attendance"
          icon={<AiOutlineContacts size={31} />}
          href={`${path}/attendance`}
        />
        {published ? (
          <SideBarButton
            label="Unlist"
            aria-label="unlist"
            func={handleUnlist}
          />
        ) : (
          <SideBarButton
            label="Publish"
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
