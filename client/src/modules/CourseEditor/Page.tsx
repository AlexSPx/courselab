import { CourseInterface } from "../../interfaces";
import { SettingsIcon, StructureIcon } from "../../svg/small";
import SideBar, {
  SideBarButton,
  SideBarHref,
  SideBarSection,
} from "../Layouts/SideBar";
import { useRouter } from "next/dist/client/router";
import Structure from "./Structure";
import GeneralSettings from "./GeneralSettings";
import useRequest from "../../lib/useRequest";
import axios from "axios";
import { baseurl } from "../../lib/fetcher";
import { mutate } from "swr";
import { IoIosLaptop } from "react-icons/io";
import Landing from "./Landing";

export default function Page({ course }: { course: CourseInterface }) {
  const router = useRouter();
  const { executeQuery } = useRequest();

  const path = `/course/edit/${course.name}`;

  const Distributor = () => {
    const { stt } = router.query;

    if (stt === "structure") return <Structure course={course} />;
    else if (stt === "landing") return <Landing course={course} />;
    else return <GeneralSettings course={course} router={router} />;
  };

  const handlePublish = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/publish`,
          { name: course.name },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Publishing",
        successTitle: "Published",
        onSuccess: () => mutate(`${baseurl}/course/fetchadmin/${course.name}`),
      }
    );
  };

  const handleUnlist = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/unlist`,
          { name: course.name },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Unlisting",
        successTitle: "Unlisted",
        onSuccess: () => mutate(`${baseurl}/course/fetchadmin/${course.name}`),
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
          href={path}
        />
        <SideBarHref
          label="Course structure"
          icon={<StructureIcon />}
          href={path + "?stt=structure"}
        />
        <SideBarHref
          label="Course landing"
          icon={<IoIosLaptop size={31} />}
          href={path + "?stt=landing"}
        />
        {course.published ? (
          <SideBarButton label="Unlist" func={handleUnlist} />
        ) : (
          <SideBarButton label="Publish" func={handlePublish} />
        )}
      </SideBar>

      <div className="flex flex-col w-full h-full items-center py-4">
        {/* <LoadingFlexCenter css="h-24 w-24" /> */}
        <Distributor />
      </div>
    </div>
  );
}
