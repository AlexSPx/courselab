import React, { useRef } from "react";
import Modal from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import formatDate from "../../../lib/dateFormater";
import { AttendanceInterface } from "../../../modules/CourseEditor/Attendance/RenderAssignment";

export default function GradeAssignment({
  onClose,
  submit,
}: {
  onClose: Function;
  submit: AttendanceInterface;
}) {
  const wrapperRef = useRef(null);

  useOnOutsideClick(wrapperRef, () => onClose());

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
          <div className="flex p-3 font-mono">
            <div className="">
              <p className="font-semibold">Latest submit:</p>{" "}
              {formatDate(submit.submits[0].dateOfSubmit)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
