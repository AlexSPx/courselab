import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { Left, Main, Right } from "../Layouts/MainLayout";
import SubmitsSection from "./SubmitsSection";

const DescriptionSection = dynamic(() => import("./DescriptionSection"), {
  ssr: false,
});

const isLateCalc = (date: Date | undefined): boolean => {
  if (!date) return false;
  if (new Date(date).getTime() > new Date().getTime()) return false;
  return true;
};

export default function Page({
  assignment,
}: {
  assignment: AssignmentInterface;
}) {
  useMemo(() => isLateCalc(assignment.submitDate), [assignment.submitDate]);

  return (
    <>
      <Left />
      <Main>
        <DescriptionSection description={assignment.content} />
        <FileSection files={assignment.files} />
      </Main>
      <Right css="flex-col">
        <SubmitsSection assignment={assignment} />
      </Right>
    </>
  );
}

const FileSection = ({ files }: { files: string[] }) => {
  const mapFiles = files?.map((file) => {
    return (
      <Link
        href={`${baseurl}/assignment/download/${file}`}
        key={file}
        passHref={true}
      >
        <a
          className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
          key={file}
        >
          {file}
        </a>
      </Link>
    );
  });

  return (
    <section className="block p-4 bg-white border border-gray-100 shadow-sm rounded-xl my-2">
      <span className="font-bold text-2xl ">Attached Files</span>
      {mapFiles}
    </section>
  );
};
