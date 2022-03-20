import { AssignmentSubmits, Prisma } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";
import { baseDir } from "../settings/multer";

const basepath = (fileName: string) => path.join(baseDir + `files/${fileName}`);

export const deleteAttachments = (submits: AssignmentSubmits[]) => {
  if (!submits) return;
  submits.forEach((submit) => {
    submit.attachments.forEach((attachment) => {
      if (!attachment) return;

      if (attachment.hasOwnProperty("path")) {
        unlink(basepath((attachment as any).path));
      } else if (attachment.hasOwnProperty("doc")) {
      }
    });
  });
};

type PrepareTodosType = {
  courses: {
    course: {
      name: string;
      public_name: string | null;
      dataModels: {
        props: { week: number; day: number; index: number };
        name: string;
      }[];
    };
    startingAt: Date;
  }[];
} | null;

export const prepareTodos = (data: PrepareTodosType) => {
  if (!data) return [];
  const { courses } = data;

  const todos: {
    name: string;
    publicName: string | null;
    todos: {
      props: { week: number; day: number; index: number };
      name: string;
    }[];
  }[] = [];
  courses.forEach((enrollment) => {
    const startingDate = enrollment.startingAt;
    const today = new Date();
    const difference = Math.ceil(
      (new Date(today).getTime() - startingDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const courseTodo: {
      props: { week: number; day: number; index: number };
      name: string;
    }[] = [];

    enrollment.course.dataModels.forEach((datamodel) => {
      if (
        datamodel.props.week === Math.floor(difference / 7) &&
        datamodel.props.day === difference % 7
      )
        courseTodo.push(datamodel);
    });

    todos.push({
      name: enrollment.course.name,
      publicName: enrollment.course.public_name,
      todos: courseTodo,
    });
  });

  return todos;
};
