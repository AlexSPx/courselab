import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useHasImage from "../../Hooks/useHasImage";
import { DataModelInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { MyCourseInterface } from "../../modules/Home";
import { Heart } from "../../svg/small";

export default function MyCourseCard({
  course,
}: {
  course: MyCourseInterface;
}) {
  const { url } = useHasImage(course.course.name, { type: "course_logo" });

  const [progression, setProgression] = useState(0);
  const [todoToday, setTodoToday] = useState<DataModelInterface[]>([]);

  useEffect(() => {
    const fetchProgression = async () => {
      const progression = await axios.get(
        `${baseurl}/course/progression/${course.course.name}`,
        { withCredentials: true }
      );

      setProgression(progression.data);
    };

    const fetchToday = async () => {
      const progression = await axios.get(
        `${baseurl}/course/today/${course.course.name}`,
        { withCredentials: true }
      );

      setTodoToday(progression.data);
    };

    fetchToday();
    fetchProgression();
  }, [course.course.name]);

  return (
    <Link href={`/learn/${course.course.name}`}>
      <a className="p-4 border max-w-2xl rounded-xl flex justify-start dark:bg-gray-800 md:flex-row flex-col gap-4 mb-3 hover:bg-gray-50 cursor-pointer">
        <div className="relative">
          <div className="rounded-xl w-36 h-28">
            <Image
              src={url}
              alt="Image"
              layout="fill"
              className="rounded-xl object-contain md:object-cover bg-gray-200"
            />
          </div>
          <span className="px-2 py-1 text-white bg-gray-700 text-xs rounded absolute right-2 bottom-2 bg-opacity-50">
            7 min
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-start justify-between text-gray-700 dark:text-white my-2 md:m-0">
            <p className="text-xl leading-5">{course.course.public_name}</p>
            <button className="text-red-400 hover:text-red-600">
              <Heart />
            </button>
          </div>
          <div className="flex flex-col items-start mt-2 md:m-0">
            <div className="flex">
              Course Progress-
              <p className="text-gray-900 italic">{Math.floor(progression)}%</p>
            </div>
            <progress
              className="progress progress-primary mt-2"
              value={progression}
              max="100"
            />
            <div className="flex w-full rounded-xl border mt-2 text-center justify-center overflow-hidden">
              <p className="px-3">Today</p>
              <div className="border border-r-1 bg-gray-700"></div>
              <div className="text-center hover:bg-gray-100 w-full">
                {todoToday.length ? todoToday[0].name : "Nothing to do today"}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

export const MyCourseCardSkeleton = () => {
  return (
    <div className="p-4 pt-6 bg-white shadow-xl animate-pulse rounded-xl flex justify-start dark:bg-gray-800 md:flex-row flex-col gap-4 w-full my-3">
      <div className="rounded-xl w-32 h-24 bg-gray-200"></div>
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between text-gray-700 dark:text-white my-2 md:m-0">
          <div className="flex w-full h-5 rounded-xl bg-gray-200"></div>
        </div>
        <div className="flex flex-col items-start mt-0 md:my-2">
          <div className="flex w-full md:w-1/2 h-5 rounded-xl bg-gray-200"></div>
          <div className="flex w-full h-2 rounded-xl mt-2 bg-gray-200"></div>
          <div className="flex w-full h-5 rounded-xl bg-gray-200 mt-2"></div>
        </div>
      </div>
    </div>
  );
};
