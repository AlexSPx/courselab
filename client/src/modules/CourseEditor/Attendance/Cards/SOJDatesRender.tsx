import { TFunction } from "react-i18next";
import React, { useState } from "react";
import DayCard from "./DayCard";
import WeekSelector from "./WeekSelector";

export default function SOJDatesRender({
  courseWeeks,
  courseName,
  t,
}: {
  courseWeeks: number;
  courseName: string;
  t: TFunction<"course_settings", undefined>;
}) {
  const [currentWeek, setCurrentWeek] = useState(0);

  const Week = () => {
    const mapDays = [...Array(7)].map((_, index) => {
      return (
        <DayCard
          courseName={courseName}
          currentWeek={currentWeek}
          index={index}
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
      <p className="font-bold text-2xl">{t("dropd-soj")}</p>
      <WeekSelector
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
        courseWeeks={courseWeeks}
        weekLabel={t("week")}
        selectDateLabel={t("select-week")}
      />
      <Week />
    </div>
  );
}
