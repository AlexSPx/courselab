import axios from "axios";
import { useState, useEffect } from "react";
import { TFunction } from "react-i18next";
import { DataModelInterface } from "../../../../interfaces";
import { baseurl } from "../../../../lib/fetcher";
import {
  DocumentIcon,
  VideoIcon,
  AssignmentIcon,
  QuizzIcon,
} from "../../../../svg/small";
import RenderAssignment from "../RenderAssignment";
import RenderQuiz from "../RenderQuiz";

export default function FileCard({
  file,
  courseName,
  startingDate,
  t,
}: {
  file: DataModelInterface;
  courseName: string;
  startingDate: Date | null;
  t: TFunction<"course_settings", undefined>;
}) {
  const [count, setCount] = useState<{ all: number; complete: number }>();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (file.type === "ASSIGNMENT" && startingDate) {
      const fetch = async () => {
        const ares = await axios.post(
          `${baseurl}/assignment/submits/count`,
          {
            course: courseName,
            assignmentId: file.assignment_id,
            startingDate: startingDate,
          },
          { withCredentials: true }
        );
        setCount({ all: ares.data.all, complete: ares.data.submitted });
      };
      fetch();
    }
  }, [courseName, file.assignment_id, file.type, startingDate]);

  const Icon = () => {
    if (file.type === "DOCUMENT") {
      return <DocumentIcon />;
    } else if (file.type === "VIDEO") {
      return <VideoIcon />;
    } else if (file.type === "ASSIGNMENT") {
      return <AssignmentIcon />;
    } else if (file.type === "QUIZ") {
      return <QuizzIcon />;
    } else {
      return <></>;
    }
  };

  return (
    <>
      <div
        className="flex relative rounded bg-slate-200 h-7 my-1 items-center justify-center cursor-pointer hover:bg-slate-300 transition duration-200 w-full"
        onClick={() => setOpened(!opened)}
      >
        <Icon />
        <p className="s font-mono">{file.name}</p>
        <p className="absolute right-6">
          {count && (
            <>
              {count.complete}/{count.all}
            </>
          )}
        </p>
      </div>
      {opened &&
        (file.type === "ASSIGNMENT" ? (
          <RenderAssignment
            id={file.assignment_id!}
            courseName={courseName}
            startingDate={startingDate}
            t={t}
          />
        ) : file.type === "DOCUMENT" ? (
          "DOC"
        ) : file.type === "VIDEO" ? (
          "VID"
        ) : (
          file.type === "QUIZ" && (
            <RenderQuiz
              id={file.quiz_id!}
              courseName={courseName}
              startingDate={startingDate}
            />
          )
        ))}
    </>
  );
}
