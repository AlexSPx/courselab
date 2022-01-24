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

export default function Page({ course }: { course: CourseInterface }) {
  const router = useRouter();

  const path = `/course/edit/${course.name}`;

  const Distributor = () => {
    const { stt } = router.query;
    switch (stt) {
      case "structure":
        return <Structure course={course} />;

      default:
        return <GeneralSettings course={course} router={router} />;
    }
  };

  const handlePublish = () => {
    try {
    } catch (error) {}
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
        <SideBarButton label="Publish" func={() => {}} />
      </SideBar>

      <div className="flex flex-col w-full h-full items-center py-4">
        {/* <LoadingFlexCenter css="h-24 w-24" /> */}
        <Distributor />
      </div>
    </div>
  );
}
