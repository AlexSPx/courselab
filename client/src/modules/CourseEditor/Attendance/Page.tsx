import { TFunction } from "react-i18next";
import { CourseInterface } from "../../../interfaces";
import { Main, MainLayout } from "../../Layouts/MainLayout";
import Schedules from "./Schedules";
import StartOnJoin from "./StartOnJoin";

export default function Page({
  course,
  t,
}: {
  course: CourseInterface;
  t: TFunction<"course_settings", undefined>;
}) {
  const Model = () => {
    if (course.scheduleType === "SCHEDULE")
      return <Schedules course={course} />;
    if (course.scheduleType === "START_ON_JOIN")
      return <StartOnJoin course={course} />;
    return <></>;
  };
  return (
    <MainLayout>
      <Main css="max-w-7xl items-center">
        <p className="text-2xl font-bold">
          Machine Learning - {t("nav-attendance")}
        </p>
        <Model />
      </Main>
    </MainLayout>
  );
}
