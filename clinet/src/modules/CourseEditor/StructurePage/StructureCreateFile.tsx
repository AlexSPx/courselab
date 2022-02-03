import axios from "axios";
import { isEmpty } from "lodash";
import { useRef, useState } from "react";
import Modal from "../../../components/Modal";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { StructureData } from "../../../Hooks/useStructureData";
import { DataModelInterface } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { CloseIcon } from "../../../svg/small";

type DataSCF = {
  day: DataModelInterface[];
  dayIndex: number;
  structureData: StructureData;
};

export type CreateFile = "Document" | "Video" | "Assignment" | "Quiz";

export default function StructureCreateFile({
  onClose,
  data,
  type,
}: {
  onClose: Function;
  data: DataSCF;
  type: CreateFile;
}) {
  const wrapperRef = useRef(null);

  const [name, setName] = useState<string>();
  const [error, setError] = useState<string>();

  useOnOutsideClick(wrapperRef, () => onClose());

  const sendRequst = async () => {
    const { day, dayIndex, structureData } = data;
    let dataModelIndex;
    if (isEmpty(day)) dataModelIndex = 0;
    else dataModelIndex = day.length;

    if (!name) {
      setError("Name must be provided");
      return;
    }

    const dataModel = {
      type: type,
      week: structureData.currentWeek,
      day: dayIndex,
      index: dataModelIndex,
      name: name,
      courseName: structureData.courseName,
    };

    const res = await axios.post<DataModelInterface>(
      `${baseurl}/course/coursedata`,
      dataModel,
      {
        withCredentials: true,
      }
    );

    structureData.addFile(res.data);
    onClose();
  };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white">
            <span className="font-semibold label">Create a new {type}</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col px-6 py-5 bg-gray-50">
            <label className="label">
              <span className="label-text">{type} Name</span>
            </label>
            <input
              type="text"
              placeholder={`${type} name`}
              className="input input-bordered border border-gray-200 rounded shadow-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setName(e.target.value);
              }}
            />
            {error && (
              <div className="flex w-full my-1 items-center justify-center text-red-600 font-semibold">
                Error: {error}
              </div>
            )}
            <button
              className="btn btn-outline my-2"
              onClick={() => sendRequst()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
