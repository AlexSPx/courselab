import React from "react";
import { CourseInterface } from "../../../interfaces";
import SOJDatesRender from "./Cards/SOJDatesRender";

export default function StartOnJoin({ course }: { course: CourseInterface }) {
  return (
    <div className="flex flex-col w-full items-center">
      {course.weeks ? (
        <SOJDatesRender courseName={course.name} courseWeeks={course.weeks} />
      ) : (
        <h1 className="font-bold text-lg">No Course Model</h1>
      )}
    </div>
  );
}
