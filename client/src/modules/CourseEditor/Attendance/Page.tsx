import { CourseInterface } from "../../../interfaces";
import { Main, MainLayout } from "../../Layouts/MainLayout";
import Schedules from "./Schedules";
import StartOnJoin from "./StartOnJoin";

export default function Page({ course }: { course: CourseInterface }) {
  // const courseData = useStructureData(course);

  // const [week, setWeek] = useState(0);

  // useEffect(() => {
  //   courseData.setCurrentWeek(week);
  // }, [courseData, week]);

  // const mapDays = courseData
  //   .getWeek()
  //   .map((day: DataModelInterface[], index: number) => {
  //     return (
  //       <Day courseName={course.name} key={index} day={day} index={index} />
  //     );
  //   });

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
        <p className="text-2xl font-bold">Machine Learning - Attendance</p>
        <Model />
      </Main>
    </MainLayout>
  );
}
