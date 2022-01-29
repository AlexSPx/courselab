import React from "react";
import useHasImage from "../../Hooks/useHasImage";
import { CourseGeneralInterface } from "../../interfaces";
import Image from "next/image";
import { BsBookmarkStar } from "react-icons/bs";
import { DownArrow } from "../../svg/small";
import Link from "next/link";

export default function Card({ course }: { course: CourseGeneralInterface }) {
  const { url } = useHasImage(`${course.name}`, { type: "course_logo" });

  return (
    <Link href={`course/${course.name}`}>
      <a className="flex flex-row w-full p-2 select-none border border-gray-900 rounded-md">
        <div className="relative w-48 h-30 rounded-md overflow-hidden">
          <Image
            layout="fill"
            className="rounded-xl object-contain md:object-cover"
            src={url}
            alt={`${course.name}'s logo`}
          />
        </div>
        <div className="flex flex-col w-4/5 sm:w-4/5 p-1 mx-4 overflow-auto">
          <span className="font-bold">{course.public_name}</span>
          <span className="text-sm text-gray-600">
            Weeks to complete: {course.weeks}
          </span>
          <span className="text-sm text-gray-600">
            Videos {course.videos} Documents {course.documents} Quizzes{" "}
            {course.quizzes} Assignments {course.assignments}{" "}
          </span>
          <button
            className="flex items-center justify-center w-3/4 btn btn-sm btn-outline mt-1"
            type="button"
          >
            Expand
            <DownArrow css="h-8 w-8 mx-3" />
          </button>
        </div>
        <div className="flex flex-col h-full w-1/5 mr-4 justify-center">
          <div className="flex flex-col mt-1">
            <button className="btn btn-sm w-full btn-outline my-1">
              Enroll
            </button>
            <button className="btn btn-sm btn-outline my-1">
              <BsBookmarkStar />
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
}
