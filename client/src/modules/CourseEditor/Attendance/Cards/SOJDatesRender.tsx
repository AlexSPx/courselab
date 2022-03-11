import React, { useState } from "react";
import DayCard from "./DayCard";
import WeekSelector from "./WeekSelector";

export default function SOJDatesRender({
  courseWeeks,
  courseName,
}: {
  courseWeeks: number;
  courseName: string;
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
      <p className="font-bold text-2xl">Free to join</p>
      <WeekSelector
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
        courseWeeks={courseWeeks}
      />
      <Week />
    </div>
  );
}
