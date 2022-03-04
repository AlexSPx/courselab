import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { CourseInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSession } from "../../../lib/withSession";
import { CourseEditorLayout } from "../CourseEditorLayout";
import Page from "./Page";

type CourseAttendanceProps = {
  course: CourseInterface;
};

export const CourseAttendance: NextPage<CourseAttendanceProps> = ({
  course,
}) => {
  return (
    <CourseEditorLayout name={course.name} published={course.published}>
      <Page course={course} />
    </CourseEditorLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, query }) => {
    const course = typeof query.name === "string" ? query.name : "";

    try {
      const courseRes = await axios.get(`${baseurl}/course/${course}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          course: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          course,
        },
      };
    }
  }
);
