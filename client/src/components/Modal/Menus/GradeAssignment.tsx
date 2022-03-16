import axios from "axios";
import React, { useRef, useState } from "react";
import Modal, { useModals } from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { baseurl } from "../../../lib/fetcher";
import useRequest from "../../../lib/useRequest";
import {
  DocumentAttachment,
  File,
  VideoAttachment,
} from "../../../modules/Assignmnet/Attachments";
import { AttendanceInterface } from "../../../modules/CourseEditor/Attendance/RenderAssignment";
import FormatDate from "../../FormatDate";

export default function GradeAssignment({
  onClose,
  submit,
}: {
  onClose: Function;
  submit: AttendanceInterface;
}) {
  const [submitIndex, setSubmitIndex] = useState(submit.submits.length - 1);
  const [comment, setComment] = useState<string | undefined>(
    submit.submits[submitIndex].comment
  );

  const { executeQuery } = useRequest();

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, () => onClose());

  const handleReturn = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/assignment/return`,
          {
            id: submit.submits[submitIndex].id,
            comment,
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Returning",
        loadingBody: "Returining the submit",
        successBody: "Returned",
      }
    );
  };

  const mapAttachments = submit.submits[submitIndex].attachments.map((att) => {
    const handleOpen = () => {
      if (att.type === "FILE") {
      } else if (att.type === "DOC") {
      } else if (att.type === "VIDEO") {
      } else if (att.type === "LINK") {
      }
    };
    if (att.type === "FILE")
      return (
        <a
          key={att.path}
          href={`${baseurl}/assignment/download/${att.path}`}
          download
          target="_blank"
          rel="noreferrer"
        >
          <File
            name={att.path!.split("{-divide-}")[2]}
            id={att.path!}
            css="mx-1 cursor-pointer hover:bg-gray-100"
          />
        </a>
      );
    if (att.type === "DOC") {
      return (
        <div key={att.doc?.id}>
          {att.doc?.type === "DOCUMENT" ? (
            <DocumentAttachment id={att.doc?.id!} />
          ) : (
            <VideoAttachment id={att.doc?.id!} />
          )}
        </div>
      );
    }
    return (
      <div key={att.path}>
        <File
          name={att.path!.split("{-divide-}")[2]}
          id={att.path!}
          css="mx-1 cursor-pointer hover:bg-gray-100"
        />
      </div>
    );
  });

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-2/3 max-w-4xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-col w-full justify-center items-center">
            <p className="text-xl font-semibold font-mono pt-5">
              {submit.enrollment.user.username}&apos;s submit
            </p>
          </div>
          <div className="divider w-full"></div>
          <div className="flex flex-col p-3 font-mono">
            <div className="mb-2">
              <p className="font-semibold">Latest submit:</p>
              <FormatDate date={submit.submits[submitIndex].dateOfSubmit} />
            </div>
            <div className="my-2">
              <p className="font-semibold">Attachments:</p>
              <div className="flex flex-wrap">{mapAttachments}</div>
            </div>
            <div className="flex flex-col w-full justify-center">
              <p className="font-semibold">Add a comment:</p>

              <textarea
                className="textarea textarea-bordered w-3/4"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                value={comment}
              />
            </div>
            <button
              className="btn btn-outline my-3"
              onClick={handleReturn}
              aria-label="Return an assignment"
            >
              {submit.submits[submitIndex].returned && "Update"} Return
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
