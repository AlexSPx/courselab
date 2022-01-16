import React from "react";
import { MyCourseCardSkeleton } from "../../components/cards/MyCourseCard";
import TodoCard, { TodoCardSkeleton } from "../../components/cards/TodoCard";
import { Main, Left, Right, MainLayout } from "../Layouts/MainLayout";

export default function SkeletonLoading() {
  return (
    <MainLayout>
      <Left></Left>
      <Main css="items-center">
        <p className="text-2xl font-light text-center">My Courses</p>
        <div className="flex w-full flex-col max-w-2xl ">
          <MyCourseCardSkeleton />
          <MyCourseCardSkeleton />
          <MyCourseCardSkeleton />
        </div>

        <div className="h-10 max-w-2xl w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </Main>
      <Right>
        <div className="hidden sm:flex flex-col p-4 w-full items-center mt-3 rounded-xl md:w-3/4 h-96 animate-pulse">
          <div className="flex flex-row items-center">
            <div className="rounded-full animate-pulse h-16 w-16 bg-gray-200"></div>

            <div className="flex flex-col mx-2">
              <div className="flex w-56 m-1 rounded-xl h-4 bg-gray-200"></div>
              <div className="flex w-36 m-1 rounded-xl h-4 bg-gray-200"></div>
            </div>
          </div>
          <div className="flex w-full mt-6 mb-2 rounded-xl h-4 bg-gray-200"></div>
          <TodoCardSkeleton />
        </div>
      </Right>
    </MainLayout>
  );
}
