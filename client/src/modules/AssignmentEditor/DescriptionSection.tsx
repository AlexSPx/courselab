import Quill from "quill";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

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

export default function DescriptionSection({
  quill,
  setQuill,
  contents,
}: {
  quill: Quill | undefined;
  setQuill: Dispatch<SetStateAction<Quill | undefined>>;
  contents: string;
}) {
  useEffect(() => {
    if (!quill) return;
    console.log(JSON.parse(contents));

    quill.setContents(JSON.parse(contents));
  }, [contents, quill]);

  const wrapperRef = useCallback(
    (wrapper: HTMLDivElement) => {
      if (typeof window === "undefined") return;
      if (wrapper === null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "bubble",
        placeholder: "Type here...",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });
      setQuill(q);
    },
    [setQuill]
  );
  return (
    <div
      ref={wrapperRef}
      className="w-full h-full min-h-[10em] border border-gray-800 rounded-md mt-2"
    ></div>
  );
}
