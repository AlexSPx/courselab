import axios from "axios";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import useStructureData, { StructureData } from "../../Hooks/useStructureData";
import { DataModelInterface, Enrollment } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import {
  AssignmentIcon,
  DocumentIcon,
  DownArrow,
  QuizzIcon,
  UpArrow,
  VideoIcon,
} from "../../svg/small";

export default function Page({ enrollment }: { enrollment: Enrollment }) {
  const courseData = useStructureData(enrollment.course!);
  const router = useRouter();

  const [available, setAvailable] = useState(
    new Date(enrollment.startingAt).getTime() < new Date().getTime()
  );

  useEffect(() => {
    courseData.setCurrentWeek(
      parseInt(typeof router.query.week === "string" ? router.query.week : "")
    );
  }, [courseData, router.query.week]);

  const renderDays = courseData
    .getWeek()
    ?.map((day: DataModelInterface[], index: number) => (
      <Day
        key={index}
        initialDay={day}
        courseData={courseData}
        courseName={enrollment.course!.name}
        index={index}
      />
    ));

  const countdownRenderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed)
      return <div className="flex text-mono">The course is starting...</div>;

    return (
      <div className="grid grid-flow-col gap-5 place-items-end auto-cols-max font-mono text-2xl">
        <div>
          <span className="font-mono text-4xl">
            <span>{days}</span>
          </span>
          days
        </div>
        <div>
          <span className="font-mono text-4xl">
            <span>{hours}</span>
          </span>
          hours
        </div>
        <div>
          <span className="font-mono text-4xl">
            <span>{minutes}</span>
          </span>
          min
        </div>
        <div>
          <span className="font-mono text-4xl">
            <span>{seconds}</span>
          </span>
          sec
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-3xl w-full h-full p-1">
      {available ? (
        <>{renderDays}</>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <Countdown
            date={enrollment.startingAt}
            onComplete={() => setAvailable(true)}
            renderer={countdownRenderer}
          />
        </div>
      )}
    </div>
  );
}

const Day = ({
  initialDay,
  index,
  courseName,
  courseData,
}: {
  initialDay: DataModelInterface[];
  index: number;
  courseName: string;
  courseData: StructureData;
}) => {
  const [dropdown, setDropdown] = useState(initialDay.length ? true : false);
  const [cooldown, setCooldown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post(
        `${baseurl}/course/files/${courseName}`,
        {
          week: router.query.week,
          day: index,
        },
        { withCredentials: true }
      );
      courseData.addFile(res.data);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 25000);
      console.log("fetched");
    };
    console.log(cooldown);

    if (dropdown && !cooldown) fetchData();
  }, [courseName, dropdown, index, cooldown, router.query.week, courseData]);

  const content = courseData.getDay(index).map((cnt) => {
    return <File key={cnt.id} router={router} file={cnt} />;
  });

  return (
    <div className="flex flex-col w-full my-4">
      <div
        className="flex flex-row w-full rounded bg-gray-200 h-12 px-4 items-center justify-between cursor-pointer hover:gray-300"
        onClick={() => setDropdown(!dropdown)}
      >
        <p className="font-mono font-semibold px-3">Today(date)</p>
        {dropdown ? <UpArrow /> : <DownArrow />}
      </div>
      {dropdown && (
        <div className="flex flex-row">
          <div className="divider divider-vertical p-0 m-0 mt-3 mx-1"></div>
          <div className="w-full mt-3">{content}</div>
        </div>
      )}
    </div>
  );
};

const File = ({
  file,
  router,
}: {
  file: DataModelInterface;
  router: NextRouter;
}) => {
  const [href, setHref] = useState<string>("");

  const Icon = () => {
    if (file.type === "DOCUMENT") {
      setHref(`${router.basePath}/doc/${file.document_id}`);
      return <DocumentIcon />;
    } else if (file.type === "VIDEO") {
      setHref(`${router.basePath}/video/${file.video_id}`);
      return <VideoIcon />;
    } else if (file.type === "ASSIGNMENT") {
      setHref(`${router.basePath}/assignment/${file.assignment_id}/edit`);
      return <AssignmentIcon />;
    } else if (file.type === "QUIZ") {
      setHref(`${router.basePath}/quiz/${file.quiz_id}/edit`);
      return <QuizzIcon />;
    } else {
      return <></>;
    }
  };

  return (
    <Link href={href}>
      <a
        target="_blank"
        className="flex rounded bg-slate-200 h-7 my-1 items-center justify-center cursor-pointer hover:bg-slate-300 transition duration-200 w-full"
      >
        <Icon />
        <p className="s font-mono">{file.name}</p>
      </a>
    </Link>
  );
};
