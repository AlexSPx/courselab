import { CourseInterface } from "../../../interfaces";
import Schedules from "./Schedules";

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

    return <></>;
  };
  return (
    <div className="flex flex-col items-center w-full max-w-7xl">
      <p className="text-2xl font-bold">Machine Learning - Attendance</p>
      <Model />
    </div>
  );
}
