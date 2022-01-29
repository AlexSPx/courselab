import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CourseInterface, Sponsor } from "../../interfaces";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Quill from "quill";
import {
  AboutUs,
  Objectives,
  Prerequisites,
  Summary,
} from "../../lib/quillSections";
import { useModals } from "../../components/Modal";
import SponsorCreate from "../../components/Modal/Menus/SponsorCreate";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "rgb(209 213 219)",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Landing({ course }: { course: CourseInterface }) {
  const [files, setFiles] = useState<File[]>();
  const [quill, setQuill] = useState<Quill>();
  const [sponsors, setSponsors] = useState<Sponsor[]>();

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        setFiles((files) => {
          const newF = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
          if (files) return [...files, ...newF];
          else return [...newF];
        });
      },
    });

  const renderPreviewImages = files?.map((file) => {
    const removeImage = () => {
      setFiles((files) => {
        return files?.filter((f) => f.preview !== file.preview);
      });
    };
    return (
      <div
        className="flex relative h-full w-24 min-w-[24rem] mx-1"
        key={file.preview}
      >
        <Image
          src={file.preview!}
          layout="fill"
          objectFit="contain"
          alt=""
          onClick={removeImage}
        />
      </div>
    );
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="flex flex-col h-full w-full items-center relative">
      <p className="flex font-bold text-2xl text-center">
        {course.public_name} - Landing page
      </p>

      <div className="divider w-[95%]">Display Images</div>
      <div className="flex flex-row w-[95%] h-[32rem] mt-6">
        <div
          className="flex flex-row w-3/4 border border-gray-300 mx-2 rounded overflow-auto"
          id="journal-scroll"
        >
          {files ? (
            renderPreviewImages
          ) : (
            <div className="flex w-full h-full items-center justify-center text-gray-500">
              Image section
            </div>
          )}
        </div>
        <div
          {...getRootProps({ style: style as any })}
          className="w-full flex items-center justify-center text-center h-[32rem]"
        >
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>
      </div>
      <div className="divider w-[95%]">Course Description</div>

      <TextDetails quill={quill} setQuill={setQuill} />

      <div className="divider w-[95%]">Sponsors</div>
      <SponsorSection sponsors={sponsors} setSponsors={setSponsors} />
      <div className="divider w-[95%]">Contacts</div>
      <div className="divider min-h-[3rem] w-[95%]">Contacts</div>
    </div>
  );
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
];

const TextDetails = ({
  quill,
  setQuill,
}: {
  quill: Quill | undefined;
  setQuill: React.Dispatch<React.SetStateAction<Quill | undefined>>;
}) => {
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

  return (
    <div className="flex w-[95%] mt-2 mb-12 relative">
      <div
        ref={wrapperRef}
        className="w-3/4 min-h-[16rem] rounded-md mb-3 mx-2 "
      ></div>
      <div className="flex flex-col w-[16rem] h-full ml-1 items-start">
        <QuillSection
          quill={quill}
          toInsert={Prerequisites}
          check="Prerequisites"
        />
        <QuillSection quill={quill} toInsert={Objectives} check="Objectives" />
        <QuillSection quill={quill} toInsert={Summary} check="Summary" />
        <QuillSection quill={quill} toInsert={AboutUs} check="About us" />
      </div>
    </div>
  );
};

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
      <button className="btn btn-outline btn-sm" onClick={handleInsertPreq}>
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

const SponsorSection = ({
  sponsors,
  setSponsors,
}: {
  sponsors: Sponsor[] | undefined;
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[] | undefined>>;
}) => {
  const { pushModal, closeModal } = useModals();

  const openCreateMenu = () => {
    const mkey = Date.now();
    pushModal(
      <SponsorCreate
        key={mkey}
        onClose={() => closeModal(mkey)}
        setSponsors={setSponsors}
      />,
      { timer: false }
    );
  };

  const mapSponsors = sponsors?.map((sponsor) => {
    return (
      <div className="flex flex-col" key={sponsor.name}>
        <Image src={sponsor.preview} width={24} height={24} alt="asd" />
        <p>{sponsor.name}</p>
      </div>
    );
  });

  return (
    <div className="flex w-[95%] mt-2 mb-12 relative items-center justify-center">
      <div className="flex flex-row">{mapSponsors}</div>
      <button className="btn btn-outline mt-2" onClick={openCreateMenu}>
        Add a sponsor
      </button>
    </div>
  );
};
