import { NextRouter, useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useRef, useState } from "react";
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

export default function Structure({ course }: { course: CourseInterface }) {
  const structureData = useStructureData(course);

  if (!structureData.data)
    return (
      <div className="flex flex-col w-full items-center justify-center">
        <p className="flex font-bold text-2xl text-center">
          {course.public_name} - Structure
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
      />
    );
  });

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <p className="flex font-bold text-2xl text-center">
        {course.public_name} - Structure
      </p>
      <div className="flex flex-col lg:flex-row w-full mt-3 items-center justify-center px-1">
        {!structureData.changes && (
          <button
            className="btn btn-sm btn-outline lg:h-full my-2 "
            onClick={() => structureData.saveWeeks()}
          >
            Save <br />
            changes
          </button>
        )}
        <div className="flex w-full md:w-3/4 lg:w-3/5 xl:w-2/5 mx-3 items-center justify-center">
          <WeekSection
            data={structureData.data}
            week={structureData.currentWeek}
            setCurrentWeek={structureData.setCurrentWeek}
          />
        </div>
        <button
          className="btn btn-outline my-2"
          onClick={() => structureData.createWeek()}
        >
          <PlusCircle /> Add week
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
}: {
  day: DataModelInterface[];
  dayIndex: number;
  structureData: StructureData;
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
        <p className="font-semibold text-2xl">Day {dayIndex + 1}</p>
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
          >
            <VideoIcon />
            New video
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Document")}
          >
            <DocumentIcon />
            New Document
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Assignment")}
          >
            <AssignmentIcon />
            New Assignemnt
          </button>
          <button
            className="btn btn-outline btn-sm h-auto w-full md:w-3/4 my-1"
            onClick={() => createFile("Quiz")}
          >
            <QuizzIcon />
            New Quizz
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
  const [href, setHref] = useState<string>("");

  const Icon = () => {
    if (data.type === "DOCUMENT") {
      setHref(`${router.basePath}/doc/${data.document_id}`);
      return <DocumentIcon />;
    } else if (data.type === "VIDEO") {
      setHref(`${router.basePath}/video/${data.video_id}`);
      return <VideoIcon />;
    } else if (data.type === "ASSIGNMENT") {
      setHref(`${router.basePath}/assignment/${data.assignment_id}/edit`);
      return <AssignmentIcon />;
    } else if (data.type === "QUIZ") {
      setHref(`${router.basePath}/quiz/${data.quiz_id}/edit`);
      return <QuizzIcon />;
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Link href={href}>
        <a
          target="_blank"
          className="flex rounded bg-gray-200 h-12 my-1 items-center justify-center cursor-pointer hover:bg-gray-300 transition duration-200"
          ref={menuRef}
        >
          <Icon />
          <p className="s font-mono">{data.name}</p>
        </a>
      </Link>
      <StructureMenu outerRef={menuRef} dataModel={data} onDelete={onDelete} />
    </>
  );
};

const WeekSection = ({
  data,
  week,
  setCurrentWeek,
}: {
  data: Object[] | null;
  week: number;
  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
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
        <p className="text-2xl font-semibold">Week {index + 1}</p>
        <div className="flex flex-row font-thin italic">
          <p className="mx-1">Videos: 3</p>
          <p className="mx-1">Readables: 2</p>
          <p className="mx-1">Assignments: 4</p>
          <p className="mx-1">Quizes: 1</p>
        </div>
      </div>
    );
  });

  const CurrentWeek = ({ week, index }: { week: object; index: number }) => {
    return (
      <div className="flex flex-col w-full h-full p-1">
        <p className="text-2xl font-semibold">Week {index + 1}</p>
        <div className="flex flex-row font-thin italic">
          <p className="mx-1">Videos: 3</p>
          <p className="mx-1">Readables: 2</p>
          <p className="mx-1">Assignments: 4</p>
          <p className="mx-1">Quizzes: 1</p>
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
