import axios from "axios";
import { TFunction } from "react-i18next";
import { useState } from "react";
import FIleAdder, {
  Attachment,
  CustomRendererProps,
} from "../../components/FIleAdder";
import FormatDate from "../../components/FormatDate";
import { AssignmentInterface, AssignmentSubmit } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import useRequest from "../../lib/useRequest";
import {
  DocumentAttachment,
  File,
  LinkAttachment,
  VideoAttachment,
} from "./Attachments";

const latestSubmit = (submits: AssignmentSubmit[]) => {
  if (!submits.length) return null;

  return submits[submits.length - 1];
};

export default function SubmitsSection({
  assignment,
  t,
}: {
  assignment: AssignmentInterface;
  t: TFunction<"docs", undefined>;
}) {
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>();
  const [toBeRemoved, setToBeRemoved] =
    useState<{ type: string; path: string }[]>();

  const [submit, setSubmit] = useState(
    latestSubmit(assignment.members[0].submits)
  );

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
    if (doc?.type === "DOCUMENT") {
      const removeDoc = async () => {
        await axios.delete(`${baseurl}/doc/${doc.id}`, {
          withCredentials: true,
        });
        remove();
      };
      return (
        <DocumentAttachment key={doc?.id} id={doc?.id!} remove={removeDoc} />
      );
    }

    if (doc?.type === "VIDEO") {
      const removeVid = async () => {
        await axios.delete(`${baseurl}/video/${doc.id}`, {
          withCredentials: true,
        });
        remove();
      };
      return <VideoAttachment key={doc?.id} id={doc?.id!} remove={removeVid} />;
    }
    if (type === "LINK") {
      return <LinkAttachment key={fakeId} link={link!} remove={remove} />;
    }
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
          name={att.path!.split("{-divide-}")[2]}
          id={att.path!}
          css={`
            ${check && "border-red-800 bg-red-50"}
          `}
          remove={remove}
        />
      );
    }
    if (att.doc?.type === "DOCUMENT") {
      const remove = () => {
        if (toBeRemoved?.some((r) => r.path === att.doc?.id!)) {
          setToBeRemoved((tbr) =>
            tbr?.filter((tr) => tr.path !== att.doc?.id!)
          );
          return;
        }
        setToBeRemoved((tbr) => {
          if (!tbr) return [{ type: att.doc!.type, path: att.doc?.id! }];
          return [...tbr, { type: att.doc!.type, path: att.doc?.id! }];
        });
      };

      const check = toBeRemoved?.some((r) => r.path === att.doc?.id!);
      return (
        <DocumentAttachment
          key={att.doc?.id}
          id={att.doc?.id!}
          css={`
            ${check && "border-red-800 bg-red-50"}
          `}
          remove={remove}
        />
      );
    }
    if (att.doc?.type === "VIDEO") {
      const remove = () => {
        if (toBeRemoved?.some((r) => r.path === att.doc?.id!)) {
          setToBeRemoved((tbr) =>
            tbr?.filter((tr) => tr.path !== att.doc?.id!)
          );
          return;
        }
        setToBeRemoved((tbr) => {
          if (!tbr) return [{ type: att.type, path: att.doc?.id! }];
          return [...tbr, { type: att.type, path: att.doc?.id! }];
        });
      };

      const check = toBeRemoved?.some((r) => r.path === att.doc?.id!);
      return (
        <DocumentAttachment
          key={att.doc?.id}
          id={att.doc?.id!}
          css={`
            ${check && "border-red-800 bg-red-50"}
          `}
          remove={remove}
        />
      );
    }
    if (att.type === "LINK") {
      const remove = () => {
        if (toBeRemoved?.some((r) => r.path === att.link)) {
          setToBeRemoved((tbr) => tbr?.filter((tr) => tr.path !== att.link));
          return;
        }
        setToBeRemoved((tbr) => {
          if (!tbr) return [{ type: att.type, path: att.link! }];
          return [...tbr, { type: att.type, path: att.link! }];
        });
      };

      const check = toBeRemoved?.some((r) => r.path === att.link!);
      return (
        <LinkAttachment
          key={att.link}
          link={att.link!}
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
      <div className="flex flex-col p-4 w-full h-full items-center justify-center bg-white border border-gray-100 shadow-sm rounded-xl">
        <section className="font-bold text-2xl w-full">
          {t("submit")}
          <p className="text-lg font-semibold">
            {submit && <FormatDate date={submit?.dateOfSubmit} />}
          </p>
        </section>

        <section className="flex flex-col relative w-full h-full mt-4 items-center">
          {submit && (
            <div className="flex flex-col items-center">
              <p className="font-semibold text-lg">{t("already-submitted")}</p>
              <div
                className="flex flex-wrap w-full h-full max-h-[14rem] items-center justify-center overflow-auto mb-3"
                id="journal-scroll"
              >
                {mapSubmited}
              </div>
            </div>
          )}

          {(!submit || submit.dateOfRemoval) && (
            <div className="flex flex-col items-center">
              <p className="font-semibold text-lg">{t("new-attachnebts")}</p>
              <FIleAdder
                type="submit"
                style="top"
                assignmentId={assignment.id}
                setOutsideData={setAttachedFiles}
                CustomRenderer={CustomFileRender}
              />
            </div>
          )}
        </section>
        {submit && !submit.dateOfRemoval ? (
          <button
            className="btn btn-outline w-full my-3"
            onClick={handleUnSubmit}
            aria-label="ussubmit assignment"
          >
            {t("unsubmit")}
          </button>
        ) : (
          <button
            className="btn btn-outline w-full my-3"
            onClick={handleSubmit}
            aria-label="submit assignment"
          >
            {t("submit")}
          </button>
        )}
      </div>
      {submit?.returned && (
        <div className="flex flex-col p-4 w-full h-fit  justify-center bg-white border border-gray-100 shadow-sm rounded-xl mt-3 mb-1">
          <p className="font-semibold text-lg pt-2 ml-2">
            {t("submit-returned")}
          </p>
          <textarea
            value={submit?.comment}
            className="w-full textarea textarea-bordered rounded-lg"
            disabled
          />
        </div>
      )}
    </>
  );
}
