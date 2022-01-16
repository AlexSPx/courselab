import React from "react";
import { WithAuth } from "../modules/Auth/withAuth";
import Landing from "../svg/Landing";

export default function Home() {
  return (
    <WithAuth requiresAuth={false}>
      <div className="container mx-auto h-full mt-56 md:mt-8 px-2">
        <div className="flex flex-col-reverse md:flex-row items-center h-1/2 w-full font-thin">
          <div className="flex flex-col w-2/3 md:w-1/2 justify-center text-left">
            <p className="text-3xl md:text-5xl font-semibold">
              Create or Enroll in courses <br className="hidden mg:flex" /> for
              free with <strong>CourseLab</strong>
            </p>
            <p className="text-xl font-normal">
              An online learning platform for students to access course-specific{" "}
              <br className="hidden mg:flex" />
              study resources. And instructors, teachers or anyone to create
              courses
            </p>
            <button className="btn btn-outline w-44 mt-6">Get Started</button>
          </div>
          <div className="flex w-full md:w-1/2 h-full justify-center">
            <div className="flex w-3/5 md:w-full justify-center">
              <Landing />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col w-full items-center justify-center mt-6">
        <p className="mx-3 text-3xl font-semibold text-center">Homework Help</p>
      </div> */}
      </div>
    </WithAuth>
  );
}
