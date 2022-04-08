import { NextRouter, useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import StructureMenu from "../../../components/Menus/StructureMenu";
import { useModals } from "../../../components/Modal";
import StructureCreateFile, { CreateFile } from "./StructureCreateFile";

import useStructureData, {
  StructureData,
} from "../../../Hooks/useStructureData";
import { CourseInterface, DataModelInterface } from "../../../interfaces";

import {
  AssignmentIcon,
  DocumentIcon,
  DownArrow,
  PlusCircle,
  QuizzIcon,
  UpArrow,
  VideoIcon,
} from "../../../svg/small";
import NoSsr from "../../../components/NoSsr";
import { TFunction } from "react-i18next";

export default function Structure({
  course,
  t,
}: {
  course: CourseInterface;
  t: TFunction<"course_settings", undefined>;
}) {
  const structureData = useStructureData(course);

  if (!structureData.data)
    return (
      <div className="flex flex-col w-full items-center justify-center">
        <p className="flex font-bold text-2xl text-center">
          {course.public_name} - {t("structure")}
        </p>
        <div
          className="btn btn-lg btn-outline mt-6"
          onClick={() => structureData.createWeek()}
        >
          Create Week 1
        </div>
      </div>
    );

  const renderAllDays = structureData.getWeek()?.map((day, index) => {
    return (
      <RenderDay
        day={day}
        dayIndex={index}
        structureData={structureData}
        key={index + "0"}
        t={t}
      />
    );
  });

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p className="flex font-bold text-2xl text-center">
        {course.public_name} - {t("structure")}
      </p>
      <div className="flex flex-col lg:flex-row w-full mt-3 items-center justify-center px-1">
        {!structureData.changes && (
          <button
            className="btn btn-sm btn-outline lg:h-full my-2 "
            onClick={() => structureData.saveWeeks()}
            aria-label="save changes"
          >
            {t("save-changes", { ns: "common" })}
          </button>
        )}
        <div className="flex w-full md:w-3/4 lg:w-3/5 xl:w-2/5 mx-3 items-center justify-center">
          <WeekSection
            data={structureData.data}
            week={structureData.currentWeek}
            setCurrentWeek={structureData.setCurrentWeek}
            t={t}
          />
        </div>
        <button
          className="btn btn-outline my-2"
          onClick={() => structureData.createWeek()}
          aria-label="add a week"
        >
          <PlusCircle /> {t("add-week")}
        </button>
      </div>

      <div className="flex flex-col w-full lg:w-3/5 mt-6 select-none">
        {renderAllDays}
      </div>
    </div>
  );
}

const RenderDay = ({
  day,
  dayIndex,
  structureData,
  t,
}: {
  day: DataModelInterface[];
  dayIndex: number;
  structureData: StructureData;
  t: TFunction<"course_settings", undefined>;
}) => {
  const router = useRouter();

  const { pushModal, closeModal } = useModals();

  const createFile = (type: CreateFile) => {
    const mkey = Date.now();

    pushModal(
      <StructureCreateFile
        onClose={() => closeModal(mkey)}
        data={{ day, dayIndex, structureData }}
        type={type}
        key={mkey}
      />,
      { timer: false }
    );
  };

  const renderFiles = day.map((data) => {
    return (
      <RenderFile
        data={data}
        router={router}
        onDelete={structureData.delFile}
        key={data.props.week + data.props.day + data.props.index}
      />
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <p className="font-semibold text-2xl">
          {t("day")} {dayIndex + 1}
        </p>
        <div className="divider my-0 w-full" />
      </div>
      <div className="flex flex-row p-1">
        <div className="flex flex-col w-3/4">
          {/* MAIN CONTENT */}
          {renderFiles}
        </div>
        <div className="divider divider-vertical mx-2" />
        <div className="flex flex-col w-1/4 items-center">
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Video")}
            aria-label="Create a video"
          >
            <VideoIcon />
            {t("new-video")}
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Document")}
            aria-label="Create a document"
          >
            <DocumentIcon />
            {t("new-document")}
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Assignment")}
            aria-label="Create an assignment"
          >
            <AssignmentIcon />
            {t("new-assignment")}
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Quiz")}
            aria-label="Create a quiz"
          >
            <QuizzIcon />
            {t("new-quiz")}
          </button>
        </div>
      </div>
    </div>
  );
};

const RenderFile = ({
  data,
  router,
  onDelete,
}: {
  data: DataModelInterface;
  router: NextRouter;
  onDelete: (dataModelId: DataModelInterface) => void;
}) => {
  const menuRef = useRef(null);
  const [href, setHref] = useState<string>();

  useEffect(() => {
    if (data.type === "DOCUMENT") {
      setHref(`${router.basePath}/doc/${data.document_id}`);
    } else if (data.type === "VIDEO") {
      setHref(`${router.basePath}/video/${data.video_id}`);
    } else if (data.type === "ASSIGNMENT") {
      setHref(`${router.basePath}/assignment/${data.assignment_id}/edit`);
    } else if (data.type === "QUIZ") {
      setHref(`${router.basePath}/quiz/${data.quiz_id}/edit`);
    }
  }, [
    data.assignment_id,
    data.document_id,
    data.quiz_id,
    data.type,
    data.video_id,
    router.basePath,
  ]);

  return (
    <NoSsr>
      <Link href={href ? href : ""}>
        <a
          target="_blank"
          className="flex rounded bg-gray-200 h-12 my-1 items-center justify-center cursor-pointer hover:bg-gray-300 transition duration-200"
          ref={menuRef}
        >
          {data.type === "DOCUMENT" ? (
            <DocumentIcon />
          ) : data.type === "VIDEO" ? (
            <VideoIcon />
          ) : data.type === "ASSIGNMENT" ? (
            <AssignmentIcon />
          ) : (
            <QuizzIcon />
          )}
          <p className="s font-mono">{data.name}</p>
        </a>
      </Link>
      <StructureMenu outerRef={menuRef} dataModel={data} onDelete={onDelete} />
    </NoSsr>
  );
};

const WeekSection = ({
  data,
  week,
  setCurrentWeek,
  t,
}: {
  data: Object[] | null;
  week: number;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  t: TFunction<"course_settings", undefined>;
}) => {
  const [active, setActive] = useState(false);

  const dropdown = data?.map((week, index) => {
    return (
      <div
        className="flex flex-col w-full h-full p-1 hover:bg-gray-900 hover:text-white"
        key={index}
        onClick={() => {
          setCurrentWeek(index);
          setActive(false);
        }}
      >
        <p className="text-2xl font-semibold">
          {t("week")} {index + 1}
        </p>
        <div className="flex flex-row font-thin italic">
          <p className="mx-1">{t("videos", { ns: "common" })}: 3</p>
          <p className="mx-1">{t("documents", { ns: "common" })}: 2</p>
          <p className="mx-1">{t("assignments", { ns: "common" })}: 4</p>
          <p className="mx-1">{t("quizzes", { ns: "common" })}: 1</p>
        </div>
      </div>
    );
  });

  const CurrentWeek = ({ week, index }: { week: object; index: number }) => {
    return (
      <div className="flex flex-col w-full h-full p-1 hover:bg-gray-900 hover:text-white">
        <p className="text-2xl font-semibold">
          {t("week")} {index + 1}
        </p>
        <div className="flex flex-row font-thin italic">
          <p className="mx-1">{t("videos", { ns: "common" })}: 3</p>
          <p className="mx-1">{t("documents", { ns: "common" })}: 2</p>
          <p className="mx-1">{t("assignments", { ns: "common" })}: 4</p>
          <p className="mx-1">{t("quizzes", { ns: "common" })}: 1</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative inline-block w-full align-middle select-none">
      <div
        className="flex flex-row w-full border px-2 py-1 border-gray-900 rounded overflow-auto cursor-pointer hover:bg-gray-900 hover:text-white transition duration-200"
        onClick={() => setActive(!active)}
      >
        <CurrentWeek week={data![week]} index={week} />
        <div className="flex w-1/5 items-center justify-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full ">
            {active ? <UpArrow /> : <DownArrow />}
          </div>
        </div>
      </div>
      {active && (
        <div
          className="absolute flex-row w-full mt-1 bg-white border border-gray-900 rounded cursor-pointer max-h-64 overflow-auto"
          id="journal-scroll"
        >
          {dropdown}
        </div>
      )}
    </div>
  );
};
