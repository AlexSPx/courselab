import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import FormatDate from "../../../components/FormatDate";
import { CourseInterface } from "../../../interfaces";
import DatesRender from "./Cards/DatesRender";

export default function Schedules({ course }: { course: CourseInterface }) {
  const [date, setDate] = useState<Date>();

  const mapDates = course.scheduledDates.map((d) => {
    return (
      <div
        className="w-[26rem] flex flex-row items-center justify-center text-center py-2 px-3 bg-gray-100 my-1 font-mono cursor-pointer hover:bg-gray-200"
        key={JSON.stringify(d.startingAt)}
        onClick={() => setDate(d.startingAt)}
      >
        <FormatDate date={d.startingAt} />
        <BsArrowRight className="mx-2" size={21} />
      </div>
    );
  });

  return (
    <div className="w-full">
      {date ? (
        <DatesRender
          date={date}
          goBack={() => setDate(undefined)}
          course={course}
        />
      ) : (
        <div className="flex flex-col items-center">{mapDates}</div>
      )}
    </div>
  );
}
