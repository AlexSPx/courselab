import axios from "axios";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import FIleAdder, {
  Attachment,
  CustomRendererProps,
} from "../../components/FIleAdder";
import { AssignmentInterface, AssignmentSubmit } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import useRequest from "../../lib/useRequest";
import { Left, Main, Right } from "../Layouts/MainLayout";
import { File } from "./Attachments";

const DescriptionSection = dynamic(() => import("./DescriptionSection"), {
  ssr: false,
});

const latestSubmit = (submits: AssignmentSubmit[]) => {
  if (!submits.length) return null;

  return submits[submits.length - 1];
};

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
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>();
  const [toBeRemoved, setToBeRemoved] =
    useState<{ type: string; path: string }[]>();

  const [submit, setSubmit] = useState(
    latestSubmit(assignment.members[0].submits)
  );
  useMemo(() => isLateCalc(assignment.submitDate), [assignment.submitDate]);

  const { executeQuery } = useRequest();

  const CustomFileRender = ({
    type,
    fakeId,
    file,
    doc,
    link,
    remove,
  }: CustomRendererProps) => {
    if (type === "FILE")
      return <File name={file!.name} id={fakeId} remove={remove} />;

    return <>{fakeId}</>;
  };

  const handleSubmit = () => {
    executeQuery(
      async () => {
        const data = new FormData();
        data.append("enrollment_id", assignment.members[0].enrollment_id);
        data.append("assignment_id", assignment.id);
        attachedFiles?.forEach((af) => {
          if (af.type === "FILE") data.append("files", af.file!);
          if (af.type === "LINK") data.append("links", af.link!);
          if (af.type === "DOCUMENT")
            data.append("docs", JSON.stringify(af.doc));
          if (af.type === "VIDEO") data.append("docs", JSON.stringify(af.doc));
        });

        toBeRemoved?.forEach((tbr) =>
          data.append("toBeRemoved", JSON.stringify(tbr))
        );
        submit?.attachments.forEach((aattc) => {
          data.append("alreadyAttached", JSON.stringify(aattc));
        });

        const res = await axios.post(`${baseurl}/assignment/submit`, data, {
          withCredentials: true,
        });

        return res;
      },
      {
        loadingBody: "Submitting",
        successBody: "Assignment has been submitted",
        onSuccess: (res) => setSubmit(res.data),
      }
    );
  };

  const handleUnSubmit = () => {
    executeQuery(
      async () => {
        const res = await axios.get(
          `${baseurl}/assignment/unsubmit/${submit?.id}`,
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingBody: "Unsubmitting",
        successBody: "Unsubmitted",
        onSuccess: (res) => setSubmit(res.data),
      }
    );
  };

  const mapSubmited = submit?.attachments.map((att) => {
    if (att.type === "FILE") {
      const remove = () => {
        if (toBeRemoved?.some((r) => r.path === att.path!)) {
          setToBeRemoved((tbr) => tbr?.filter((tr) => tr.path !== att.path!));
          return;
        }
        setToBeRemoved((tbr) => {
          if (!tbr) return [{ type: att.type, path: att.path! }];
          return [...tbr, { type: att.type, path: att.path! }];
        });
      };

      const check = toBeRemoved?.some((r) => r.path === att.path!);
      return (
        <File
          key={att.path}
          name={att.path!.split("###")[2]}
          id={att.path!}
          css={`
            ${check && "border-red-800 bg-red-50"}
          `}
          remove={remove}
        />
      );
    }
  });

  return (
    <>
      <Left />
      <Main>
        <DescriptionSection description={assignment.content} />
        <FileSection files={assignment.files} />
      </Main>
      <Right>
        <div className="flex flex-col p-4 w-full h-full items-center justify-center bg-white border border-gray-100 shadow-sm rounded-xl my-2">
          <p className="font-bold text-2xl w-full">
            Submit{" "}
            <p className="text-lg font-semibold">
              (
              {new Date(assignment.submitDate!).toLocaleDateString(undefined, {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              )
            </p>
          </p>

          <div className="flex flex-col relative w-full h-full mt-4 items-center">
            <div className="flex flex-col items-center">
              <p className="font-semibold text-lg">Already Submitted</p>
              <div
                className="flex flex-wrap w-full h-full max-h-[20rem] items-center justify-center overflow-auto mb-3"
                id="journal-scroll"
              >
                {mapSubmited}
              </div>
            </div>

            {submit?.dateOfRemoval && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-lg">New Attachments</p>
                <FIleAdder
                  type="submit"
                  style="top"
                  assignmentId={assignment.id}
                  setOutsideData={setAttachedFiles}
                  CustomRenderer={CustomFileRender}
                />
              </div>
            )}
          </div>
          {!submit?.dateOfRemoval ? (
            <button
              className="btn btn-outline w-full my-3"
              onClick={handleUnSubmit}
            >
              Unsubmit
            </button>
          ) : (
            <button
              className="btn btn-outline w-full my-3"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </Right>
    </>
  );
}

const FileSection = ({ files }: { files: string[] }) => {
  const mapFiles = files?.map((file) => {
    const download = async () => {
      const res = await axios.post(
        `${baseurl}/assignment/download`,
        { name: file },
        { withCredentials: true, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file);
      document.body.appendChild(link);
      link.click();
    };
    return (
      <div
        className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
        key={file}
        onClick={download}
      >
        {file}
      </div>
    );
  });

  return (
    <div className="block p-4 bg-white border border-gray-100 shadow-sm rounded-xl my-2">
      <span className="font-bold text-2xl ">Attached Files</span>
      {mapFiles}
    </div>
  );
};
