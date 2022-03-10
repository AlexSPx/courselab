import axios from "axios";
import Quill from "quill";
import { useCallback, useState, useEffect } from "react";
import { baseurl } from "../../../lib/fetcher";
import {
  Prerequisites,
  Objectives,
  Summary,
  AboutUs,
} from "../../../lib/quillSections";
import useRequest from "../../../lib/useRequest";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextDetails({
  quill,
  setQuill,
  courseName,
}: {
  quill: Quill | undefined;
  setQuill: React.Dispatch<React.SetStateAction<Quill | undefined>>;
  courseName: string;
}) {
  const { executeQuery } = useRequest();

  const wrapperRef = useCallback(
    (wrapper: HTMLDivElement) => {
      if (typeof window === "undefined") return;
      if (wrapper === null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        placeholder:
          "Here you can provide addictional information about the course",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
        bounds: "journal-scroll",
      });
      setQuill(q);
    },
    [setQuill]
  );

  const handleSaveChanges = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/details/desc/${courseName}`,
          { description: JSON.stringify(quill?.getContents()) },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingBody: "Saving changes",
        successBody: "Changes have saved",
      }
    );
  };

  return (
    <div className="flex w-[95%] mt-2 mb-12 relative">
      <div
        ref={wrapperRef}
        className="w-3/4 min-h-[16rem] rounded-md mb-3 mx-2 "
      ></div>
      <div className="flex flex-col justify-between w-[16rem] h-full ml-1 items-start">
        <div className="flex flex-col">
          <QuillSection
            quill={quill}
            toInsert={Prerequisites}
            check="Prerequisites"
          />
          <QuillSection
            quill={quill}
            toInsert={Objectives}
            check="Objectives"
          />
          <QuillSection quill={quill} toInsert={Summary} check="Summary" />
          <QuillSection quill={quill} toInsert={AboutUs} check="About us" />
        </div>
        <button
          className="btn btn-outline w-full"
          onClick={handleSaveChanges}
          aria-label="save changes"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

const QuillSection = ({
  quill,
  toInsert,
  check,
  label = check,
}: {
  quill: Quill | undefined;
  toInsert: any;
  check: string;
  label?: string;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleInsertPreq = () => {
    quill?.updateContents(toInsert);
  };

  useEffect(() => {
    const handler = () => {
      if (!quill) return;
      const text = quill.getText();
      if (text.toLocaleLowerCase().includes(check.toLowerCase()))
        setIsChecked(true);
      else setIsChecked(false);
    };

    quill?.on("text-change", handler);

    return function cleanup() {
      quill?.off("text-change", handler);
    };
  }, [check, quill]);

  return (
    <div className="flex flex-row items-center">
      <button
        className="btn btn-outline btn-sm"
        onClick={handleInsertPreq}
        aria-label="Insert"
      >
        Insert
      </button>
      <label className="cursor-pointer label">
        <input
          type="checkbox"
          checked={isChecked}
          className="checkbox"
          readOnly={true}
        />
        <span className="label-text mx-1 text-lg">{label}</span>
      </label>
    </div>
  );
};
