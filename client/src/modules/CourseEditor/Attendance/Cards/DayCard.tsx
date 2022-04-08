import axios from "axios";
import { TFunction } from "react-i18next";
import { useState, useEffect } from "react";
import FormatDate from "../../../../components/FormatDate";
import { DataModelInterface } from "../../../../interfaces";
import { baseurl } from "../../../../lib/fetcher";
import { UpArrow, DownArrow } from "../../../../svg/small";
import FileCard from "./FileCard";

export type DayCardProps = {
  courseName: string;
  currentWeek: number;
  startingDate?: Date;
  index: number;
  t: TFunction;
};

export default function DayCard({
  courseName,
  currentWeek,
  startingDate,
  index,
  t,
}: DayCardProps) {
  const [dropdown, setDropdown] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [files, setFiles] = useState<DataModelInterface[]>();
  const [isUnlocked, setIsUnlocked] = useState<{
    isUnlocked: boolean;
    unlockingAt: Date | null;
  }>({
    isUnlocked: true,
    unlockingAt: null,
  });

  useEffect(() => {
    if (!startingDate) return;
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
      <FileCard
        file={files}
        courseName={courseName}
        startingDate={startingDate || null}
        key={files.id}
        t={t}
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
          {t("day")} {index + 1}(
          {isUnlocked?.unlockingAt ? (
            <FormatDate date={isUnlocked?.unlockingAt} />
          ) : (
            t("already-started")
          )}
          )
          <p className="text-sm">
            {!isUnlocked?.isUnlocked && t("not-yet-unlocked")}
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
}
