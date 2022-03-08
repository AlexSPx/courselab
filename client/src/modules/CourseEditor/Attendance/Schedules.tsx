import axios from "axios";
import Link from "next/link";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import FormatDate from "../../../components/FormatDate";
import useStructureData from "../../../Hooks/useStructureData";
import { CourseInterface, DataModelInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import {
  UpArrow,
  DownArrow,
  AssignmentIcon,
  DocumentIcon,
  QuizzIcon,
  VideoIcon,
} from "../../../svg/small";
import RenderAssignment from "./RenderAssignment";
import RenderQuiz from "./RenderQuiz";

export default function Schedules({ course }: { course: CourseInterface }) {
  const [date, setDate] = useState<Date>();

  const mapDates = course.scheduledDates.map((d) => {
    return (
      <div
        className="w-[26rem] flex flex-row items-center justify-center text-center py-2 px-3 bg-gray-100 my-1 font-mono cursor-pointer hover:bg-gray-200"
        key={JSON.stringify(d.startingAt)}
        onClick={() => setDate(d.startingAt)}
      >
        <FormatDate date={d.startingAt} />
        <BsArrowRight className="mx-2" size={21} />
      </div>
    );
  });

  return (
    <div className="w-full">
      {date ? (
        <RenderDate
          date={date}
          goBack={() => setDate(undefined)}
          course={course}
        />
      ) : (
        <div className="flex flex-col items-center">{mapDates}</div>
      )}
    </div>
  );
}

const RenderDate = ({
  date,
  course,
  goBack,
}: {
  date: Date;
  course: CourseInterface;
  goBack: () => void;
}) => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const WeekSelector = () => {
    return (
      <select
        onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
        className="select select-bordered w-full max-w-md mt-10"
        value={currentWeek}
      >
        <option value="def" defaultChecked={true}>
          Select a date
        </option>
        {mapWeekOptions}
      </select>
    );
  };

  const mapWeekOptions = [...Array(course.weeks)].map((_, index) => {
    return (
      <option value={`${index}`} key={index}>
        Week {index + 1}
      </option>
    );
  });

  const Week = () => {
    const mapDays = [...Array(7)].map((_, index) => {
      return (
        <Day
          courseName={course.name}
          currentWeek={currentWeek}
          index={index}
          startingDate={date}
          key={`${currentWeek}-${index}`}
        />
      );
    });

    return (
      <div className="flex flex-col w-full" key={`w${currentWeek}`}>
        {mapDays}
      </div>
    );
  };

  return (
    <div className="flex flex-col relative w-full items-center mt-2">
      <BsArrowLeft
        size={36}
        className="absolute left-0 top-1 rounded cursor-pointer hover:bg-gray-300"
        onClick={goBack}
      />
      <p className="font-bold text-2xl">
        <FormatDate date={date} />
      </p>
      <WeekSelector />
      <Week />
    </div>
  );
};

const Day = ({
  courseName,
  currentWeek,
  startingDate,
  index,
}: {
  courseName: string;
  currentWeek: number;
  startingDate: Date;
  index: number;
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [files, setFiles] = useState<DataModelInterface[]>();
  const [isUnlocked, setIsUnlocked] =
    useState<{ isUnlocked: boolean; unlockingAt: Date }>();

  useEffect(() => {
    const date = new Date(startingDate);
    date.setDate(date.getDate() + index);
    if (currentWeek) date.setDate(date.getDate() + currentWeek * 7);

    setIsUnlocked({
      isUnlocked: new Date(date).getTime() < new Date().getTime(),
      unlockingAt: date,
    });
  }, [currentWeek, index, startingDate]);

  const fetch = async () => {
    if (cooldown) return;
    const res = await axios.post(
      `${baseurl}/course/files/${courseName}`,
      {
        week: currentWeek,
        day: index,
      },
      { withCredentials: true }
    );
    setFiles(res.data);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 25000);
  };

  const mapFiles = files?.map((files, index) => {
    return (
      <File
        file={files}
        courseName={courseName}
        startingDate={startingDate}
        key={files.id}
      />
    );
  });

  return (
    <div className="flex flex-col w-full my-4">
      <div
        className="flex flex-row w-full rounded bg-gray-200 h-12 px-4 items-center justify-between cursor-pointer hover:gray-300"
        onClick={() => {
          setDropdown(!dropdown);
          fetch();
        }}
      >
        <div className="font-mono font-semibold px-3">
          Day {index + 1}(
          {isUnlocked?.unlockingAt && (
            <FormatDate date={isUnlocked?.unlockingAt} />
          )}
          )
          <p className="text-sm">
            {!isUnlocked?.isUnlocked && "Not yet unlocked"}
          </p>
        </div>
        {dropdown ? <UpArrow /> : <DownArrow />}
      </div>
      {dropdown && (
        <div className="flex flex-row">
          <div className="divider divider-vertical p-0 m-0 mt-3 mx-1"></div>
          <div className="w-full mt-3">{mapFiles}</div>
        </div>
      )}
    </div>
  );
};

const File = ({
  file,
  courseName,
  startingDate,
}: {
  file: DataModelInterface;
  courseName: string;
  startingDate: Date;
}) => {
  const [count, setCount] = useState<{ all: number; complete: number }>();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (file.type === "ASSIGNMENT") {
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
};
