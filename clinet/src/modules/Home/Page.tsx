import { useContext } from "react";
import Link from "next/link";
import MyCourseCard from "../../components/cards/MyCourseCard";
import TodoCard from "../../components/cards/TodoCard";
import DatePickerEx from "../../components/DatePickerEx";
import { UserContext } from "../../contexts/UserContext";
import { Left, Main, Right } from "../Layouts/MainLayout";

import Avatar from "../../components/Avatar";
import { MyCourseInterface } from ".";

export default function Page({ courses }: { courses: MyCourseInterface[] }) {
  const { userData } = useContext(UserContext);

  const mapCourses = courses.map((course) => {
    return <MyCourseCard course={course} key={course.id} />;
  });

  return (
    <>
      <Left></Left>
      {/* <div className="h-full border-r"></div> */}
      <Main css="items-center">
        <p className="text-2xl font-light text-center">My Courses</p>
        <div className="flex flex-col mt-3 w-full max-w-2xl">{mapCourses}</div>
        <Link href="/course/create">
          <a className="btn max-w-2xl w-full">Create a Course</a>
        </Link>
      </Main>
      {/* <div className="h-full border-l"></div> */}
      <Right>
        <div className="hidden sm:flex flex-col p-4 w-full items-center mt-3 rounded-xl md:w-3/4 h-96">
          <div className="flex flex-row items-center">
            <div className="avatar online h-16 w-16">
              <Avatar />
            </div>
            <div className="flex flex-col mx-2">
              <p className="text-xl font-semibold">
                {userData?.user?.first_name} {userData?.user?.last_name}
              </p>
              <p className="text-gray-600 italic">
                @{userData?.user?.username}
              </p>
            </div>
          </div>
          <div className="divider w-full italic">To-Do</div>
          <DatePickerEx />
          <TodoCard />
        </div>
      </Right>
    </>
  );
}
