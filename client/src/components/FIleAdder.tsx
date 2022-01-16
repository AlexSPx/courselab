import { useRef, useState } from "react";
import { AiOutlinePlus, AiOutlineVideoCameraAdd } from "react-icons/ai";
import { BsPaperclip, BsLink } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import useOnOutsideClick from "../Hooks/useOnOutsideClick";

export default function FIleAdder({
  type,
  assignmentId,
}: {
  type: string;
  assignmentId?: string;
}) {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="relative flex flex-col select-none">
      <div
        className={`flex flex-row items-center border border-gray-800 py-1 px-6 hover:text-white hover:bg-gray-800 cursor-pointer ${
          dropdown && "text-white bg-gray-800"
        }`}
        onClick={() => setDropdown(!dropdown)}
      >
        <AiOutlinePlus size={20} className="mr-2" />
        <p className="font-[600] uppercase">Add or attach a file</p>
      </div>
      {dropdown && <FileOptions onClose={() => setDropdown(false)} />}
    </div>
  );
}

const FileOptions = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef(null);

  useOnOutsideClick(ref, onClose);

  return (
    <div
      className="absolute top-9 bg-white flex flex-col mt-1 border border-gray-400 rounded py-2 w-44"
      ref={ref}
    >
      <div className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer">
        <BsPaperclip size={18} className="mx-4" />
        <p>File</p>
      </div>
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
