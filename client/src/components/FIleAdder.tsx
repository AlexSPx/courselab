import axios from "axios";
import { uniqueId } from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiOutlinePlus, AiOutlineVideoCameraAdd } from "react-icons/ai";
import { BsPaperclip, BsLink } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import useOnOutsideClick from "../Hooks/useOnOutsideClick";
import { baseurl } from "../lib/fetcher";
import useRequest from "../lib/useRequest";

export type CustomRendererProps = Attachment & {
  remove: () => void;
};

export type Attachment = {
  fakeId: string;
  type: "FILE" | "DOCUMENT" | "LINK" | "VIDEO";
  file?: File | null;
  doc?: {
    type: "DOCUMENT" | "VIDEO";
    name: string;
    id: string;
  };
  link?: string;
};

export default function FIleAdder({
  type,
  style = "bottom",
  assignmentId,
  setOutsideData,
  CustomRenderer,
}: {
  type: "upload" | "submit";
  style?: "top" | "bottom";
  assignmentId: string;
  setOutsideData?: Dispatch<SetStateAction<Attachment[] | undefined>>;
  CustomRenderer?: ({}: CustomRendererProps) => JSX.Element;
}) {
  const [dropdown, setDropdown] = useState(false);
  const [files, setFiles] = useState<Attachment[]>();
  const [links, setLinks] = useState<string>();

  useEffect(() => {
    if (!setOutsideData) return;
    setOutsideData(files);
  }, [files, setOutsideData]);

  const { executeQuery } = useRequest();

  const handleFileSave = async () => {
    if (!files) return;
    executeQuery(
      async () => {
        const data = new FormData();
        files.forEach((file) => {
          if (file.type === "FILE") data.append("files", file.file!);
        });
        data.append("assigment_id", assignmentId);
        data.append("type", type);
        const res = await axios.post(
          `${baseurl}/assignment/file/upload`,
          data,
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Uploading...",
        successBody: "Successfully uploaded",
      }
    );
  };

  const mapFiles = files?.map((file) => {
    const remove = () =>
      setFiles(files?.filter((f) => f.fakeId !== file.fakeId));
    if (CustomRenderer) {
      return (
        <CustomRenderer
          fakeId={file.fakeId}
          file={file.file}
          type={file.type}
          link={file.link}
          doc={file.doc}
          remove={remove}
        />
      );
    }

    return (
      <div
        className="flex flex-row rounded px-4 py-1 border border-gray-400 mt-1 mx-1 cursor-pointer font-mono font-semibold  hover:bg-gray-200"
        key={file.fakeId}
        onClick={remove}
      >
        {file.fakeId}
      </div>
    );
  });

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col relative w-64 items-center select-none">
        <div
          className={`flex flex-row items-center border border-gray-800 py-1 px-6 hover:text-white hover:bg-gray-800 cursor-pointer ${
            dropdown && "text-white bg-gray-800"
          }`}
          onClick={() => setDropdown(!dropdown)}
        >
          <AiOutlinePlus size={20} className="mr-2" />
          <p className="font-[600] uppercase">Add or attach a file</p>
        </div>
        {dropdown && (
          <FileOptions
            onClose={() => setDropdown(false)}
            setFiles={setFiles}
            setLinks={setLinks}
          />
        )}
      </div>
      <div
        className={`flex flex-wrap w-full h-full max-h-[14rem] items-center justify-center overflow-auto mb-3 ${
          style === "bottom" ? "order-last" : "order-first"
        }`}
        id="journal-scroll"
      >
        {mapFiles}
      </div>
      {type === "upload" && (
        <button
          className="btn btn-outline btn-sm mt-3 w-64"
          onClick={handleFileSave}
        >
          Upload Files
        </button>
      )}
    </div>
  );
}

const FileOptions = ({
  onClose,
  setFiles,
  setLinks,
}: {
  onClose: () => void;
  setFiles: React.Dispatch<SetStateAction<Attachment[] | undefined>>;
  setLinks: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const ref = useRef(null);

  useOnOutsideClick(ref, onClose);

  return (
    <div
      className="absolute top-9 bg-white flex flex-col mt-1 border border-gray-400 rounded py-2 w-44"
      ref={ref}
    >
      <label className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer">
        <input
          type="file"
          multiple={true}
          className="hidden"
          onChange={(e) => {
            if (
              !e ||
              !e.target.files ||
              e.target.files === null ||
              !e.target.files.length
            )
              return;

            if (!e.target.files) return;
            setFiles((files) => {
              const temp: Attachment[] = [];
              if (!e.target.files) return;
              for (let index = 0; index < e.target.files!.length; index++) {
                temp.push({
                  type: "FILE",
                  file: e.target.files.item(index),
                  fakeId: uniqueId(),
                });
              }

              if (!files) return [...temp];
              return [...files, ...temp];
            });
          }}
        />
        <BsPaperclip size={18} className="mx-4" />
        <p>File</p>
      </label>
      <div className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer">
        <BsLink size={18} className="mx-4" />
        <p>Link</p>
      </div>
      <div className="border-b border-gray-400 w-full my-1"></div>
      <p className="p-2 text-sm font-semibold text-gray-500 ">Create</p>
      <div className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer">
        <GrDocumentText size={16} className="mx-4" />
        <p>Document</p>
      </div>
      <div className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer">
        <AiOutlineVideoCameraAdd size={16} className="mx-4" />
        <p>Video</p>
      </div>
    </div>
  );
};

const AddLink = () => {};
