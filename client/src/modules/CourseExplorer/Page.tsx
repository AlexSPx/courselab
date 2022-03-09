import React, { useMemo } from "react";
import { CourseGeneralRawInterface } from ".";
import { CourseGeneralInterface, dataModelType } from "../../interfaces";
import { Left, Right, Main } from "../Layouts/MainLayout";
import Card from "./Card";

export default function Page({
  coursesRaw,
}: {
  coursesRaw: CourseGeneralRawInterface[];
}) {
  const courses = useMemo<CourseGeneralInterface[]>(
    () => formatRawData(coursesRaw) as any,
    [coursesRaw]
  );

  const mapCourses = courses.map((course) => {
    return <Card key={course.name} course={course} />;
  });

  return (
    <>
      <Left />
      <Main>
        <div className="flex flex-wrap h-full justify-center">{mapCourses}</div>
      </Main>
      <Right />
    </>
  );
}

export const formatRawData = (courses: CourseGeneralRawInterface[]) => {
  return courses.map((course) => {
    let videos = 0,
      documents = 0,
      quizzes = 0,
      assignments = 0;

    course.dataModels?.forEach((dm) => {
      if (dm.type === "DOCUMENT") documents++;
      else if (dm.type === "VIDEO") videos++;
      else if ((dm.type = "QUIZ")) quizzes++;
      else assignments++;
    });

    return {
      ...removeDataModels(course as any),
      videos,
      documents,
      quizzes,
      assignments,
    };
  });
};

const removeDataModels = ({
  dataModels,
  ...rest
}: {
  dataModels: dataModelType;
}) => rest;
