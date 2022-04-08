import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { Attachment } from "../AssignmentEditor/Page";
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
  // const isLate = useMemo(() => isLateCalc(assignment.submitDate), [assignment.submitDate]);
  const { t } = useTranslation("docs");
  return (
    <>
      <Left />
      <Main>
        <DescriptionSection
          description={assignment.content}
          placeholder={t("assignment-desc-placeholder")}
          label={t("assignment-desc")}
        />
        <FileSection
          files={assignment.files}
          filesLabel={t("attached-files")}
        />
      </Main>
      <Right css="flex-col">
        <SubmitsSection assignment={assignment} t={t} />
      </Right>
    </>
  );
}

const FileSection = ({
  files,
  filesLabel,
}: {
  files: string[];
  filesLabel: string;
}) => {
  const mapFiles = files?.map((file) => {
    const type = file.split("{-divide-}")[0];
    const id = file.split("{-divide-}")[2];
    if (type === "doc" || type === "video") {
      return <Attachment type={type} id={id} key={file} />;
    }
    return (
      <Link
        href={`${baseurl}/assignment/download/${file}`}
        passHref={true}
        key={file}
      >
        <a
          className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
          key={file}
        >
          {id}
        </a>
      </Link>
    );
  });

  return (
    <section className="block p-4 bg-white border border-gray-100 shadow-sm rounded-xl my-2">
      <span className="font-bold text-2xl ">{filesLabel}</span>
      {mapFiles}
    </section>
  );
};
