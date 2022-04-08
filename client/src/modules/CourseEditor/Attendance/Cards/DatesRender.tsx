import { useTranslation } from "next-i18next";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import FormatDate from "../../../../components/FormatDate";
import { CourseInterface } from "../../../../interfaces";
import DayCard from "./DayCard";
import WeekSelector from "./WeekSelector";

export default function DatesRender({
  date,
  course,
  goBack,
}: {
  date: Date;
  course: CourseInterface;
  goBack?: () => void;
}) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const { t } = useTranslation("course_settings");
  const Week = () => {
    const mapDays = [...Array(7)].map((_, index) => {
      return (
        <DayCard
          courseName={course.name}
          currentWeek={currentWeek}
          index={index}
          startingDate={date}
          key={`${currentWeek}-${index}`}
          t={t}
        />
      );
    });

    return (
      <div className="flex flex-col w-full" key={`w${currentWeek}`}>
        {mapDays}
      </div>
    );
  };

  return (
    <div className="flex flex-col relative w-full items-center mt-2">
      <BsArrowLeft
        size={36}
        className="absolute left-0 top-1 rounded cursor-pointer hover:bg-gray-300"
        onClick={goBack}
      />
      <p className="font-bold text-2xl">
        <FormatDate date={date} />
      </p>
      <WeekSelector
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
        courseWeeks={course.weeks!}
        weekLabel={t("week")}
        selectDateLabel={t("select-week")}
      />
      <Week />
    </div>
  );
}
