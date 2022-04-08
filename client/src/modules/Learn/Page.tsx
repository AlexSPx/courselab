import axios from "axios";
import { TFunction } from "react-i18next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown, {
  CountdownRendererFn,
  CountdownRenderProps,
} from "react-countdown";
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

interface CountdownLabels {
  daysLabel: string;
  hoursLabel: string;
  minutesLabel: string;
  secondsLabel: string;
  startingLabel: string;
}
const countdownRenderer: CountdownRendererFn = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  daysLabel,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  startingLabel,
}: CountdownRenderProps & CountdownLabels) => {
  if (completed) return <div className="flex text-mono">{startingLabel}</div>;

  return (
    <div className="grid grid-flow-col gap-5 place-items-end auto-cols-max font-mono text-2xl">
      <div>
        <span className="font-mono text-4xl">
          <span>{days}</span>
        </span>
        {daysLabel}
      </div>
      <div>
        <span className="font-mono text-4xl">
          <span>{hours}</span>
        </span>
        {hoursLabel}
      </div>
      <div>
        <span className="font-mono text-4xl">
          <span>{minutes}</span>
        </span>
        {minutesLabel}
      </div>
      <div>
        <span className="font-mono text-4xl">
          <span>{seconds}</span>
        </span>
        {secondsLabel}
      </div>
    </div>
  );
};

export default function Page({
  enrollment,
  t,
}: {
  enrollment: Enrollment;
  t: TFunction;
}) {
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
        startingDate={enrollment.startingAt}
        index={index}
        t={t}
      />
    ));

  return (
    <div className="flex flex-col items-center max-w-3xl w-full h-full p-1">
      {available ? (
        <>{renderDays}</>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <Countdown
            date={enrollment.startingAt}
            onComplete={() => setAvailable(true)}
            renderer={(props) =>
              countdownRenderer({
                ...props,
                daysLabel: t("days"),
                hoursLabel: t("hours"),
                minutesLabel: t("minutes"),
                secondsLabel: t("seconds"),
                startingLabel: t("course-starting"),
              })
            }
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
  startingDate,
  t,
}: {
  initialDay: DataModelInterface[];
  index: number;
  courseName: string;
  courseData: StructureData;
  startingDate: Date;
  t: TFunction;
}) => {
  const [dropdown, setDropdown] = useState(initialDay.length ? true : false);
  const [cooldown, setCooldown] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<{
    isUnlocked: boolean;
    unlockingAt: Date;
  }>();
  const router = useRouter();

  useEffect(() => {
    const date = new Date(startingDate);
    date.setDate(date.getDate() + index);
    if (router.query.week && typeof router.query.week === "string")
      date.setDate(date.getDate() + parseInt(router.query.week) * 7);

    setIsUnlocked({
      isUnlocked: new Date(date).getTime() < new Date().getTime(),
      unlockingAt: date,
    });
  }, [index, router.query.week, startingDate]);

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
      const timer = setTimeout(() => setCooldown(false), 25000);

      return () => {
        clearTimeout(timer);
      };
    };
    if (dropdown && !cooldown && isUnlocked) fetchData();
  }, [
    courseName,
    dropdown,
    index,
    cooldown,
    router.query.week,
    courseData,
    isUnlocked,
  ]);

  const content = courseData.getDay(index).map((cnt) => {
    return <File key={cnt.id} router={router} file={cnt} />;
  });

  const getUnlockDate = () => {
    return isUnlocked?.unlockingAt.toLocaleDateString(undefined, {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col w-full my-4">
      <div
        className="flex flex-row w-full rounded bg-gray-200 h-12 px-4 items-center justify-between cursor-pointer hover:gray-300"
        onClick={() => setDropdown(!dropdown)}
      >
        <p className="font-mono font-semibold px-3">
          {t("day")} {index + 1}({getUnlockDate()})
        </p>
        {dropdown ? <UpArrow /> : <DownArrow />}
      </div>
      {dropdown && isUnlocked && (
        <div className="flex flex-row">
          <div className="divider divider-vertical p-0 m-0 mt-3 mx-1"></div>
          <div className="w-full mt-3">
            {isUnlocked?.isUnlocked ? (
              <>{content.length ? content : t("there-is-nothing")}</>
            ) : (
              <Countdown
                date={isUnlocked.unlockingAt}
                onComplete={() =>
                  setIsUnlocked({
                    isUnlocked: true,
                    unlockingAt: isUnlocked.unlockingAt,
                  })
                }
                renderer={(props) =>
                  countdownRenderer({
                    ...props,
                    daysLabel: t("days"),
                    hoursLabel: t("hours"),
                    minutesLabel: t("minutes"),
                    secondsLabel: t("seconds"),
                    startingLabel: t("day-starting"),
                  })
                }
              />
            )}
          </div>
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
      setHref(`${router.basePath}/assignment/${file.assignment_id}`);
      return <AssignmentIcon />;
    } else if (file.type === "QUIZ") {
      setHref(`${router.basePath}/quiz/${file.quiz_id}`);
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
