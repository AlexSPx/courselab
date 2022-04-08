import axios from "axios";
import { uniqueId } from "lodash";
import { useTranslation } from "next-i18next";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { TFunction } from "react-i18next";
import { AiOutlinePlus, AiOutlineVideoCameraAdd } from "react-icons/ai";
import { BsPaperclip, BsLink } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { useSWRConfig } from "swr";
import useOnOutsideClick from "../Hooks/useOnOutsideClick";
import { baseurl } from "../lib/fetcher";
import useRequest from "../lib/useRequest";
import { CloseIcon } from "../svg/small";
import Modal, { useModals } from "./Modal";

export type CustomRendererProps = Attachment & {
  remove: () => void;
};

export type Attachment = {
  fakeId: string;
  type: "FILE" | "DOCUMENT" | "VIDEO" | "LINK";
  file?: File | null;
  doc?: {
    type: "DOCUMENT" | "VIDEO";
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

  useEffect(() => {
    if (!setOutsideData) return;
    setOutsideData(files);
  }, [files, setOutsideData]);

  const { executeQuery } = useRequest();
  const { t } = useTranslation("docs");
  const { mutate } = useSWRConfig();

  const handleCreateDoc = async () => {
    executeQuery(
      async () => {
        const docRes = await axios.post(
          `${baseurl}/doc/create`,
          {},
          { withCredentials: true }
        );

        if (type === "submit") return docRes;

        const res = await axios.post(
          `${baseurl}/assignment/file/attach`,
          {
            assignment_id: assignmentId,
            id: `doc{-divide-}username{-divide-}${docRes.data}`,
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Creating document",
        successBody: "Document has been created",
        onSuccess: (res) => {
          if (type === "upload") {
            mutate(`${baseurl}/assignment/files/${assignmentId}`);
          } else {
            setFiles((files) => {
              const att: Attachment = {
                fakeId: res.data,
                type: "DOCUMENT",
                doc: { type: "DOCUMENT", id: res.data },
              };
              if (!files) return [att];
              return [...files, att];
            });
          }
        },
      }
    );
  };

  const handleCreateVideo = async () => {
    executeQuery(
      async () => {
        const docRes = await axios.post(
          `${baseurl}/video/create`,
          {},
          { withCredentials: true }
        );

        if (type === "submit") return docRes;

        const res = await axios.post(
          `${baseurl}/assignment/file/attach`,
          {
            assignment_id: assignmentId,
            id: `video{-divide-}username{-divide-}${docRes.data}`,
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Creating video",
        successBody: "Video has been created",
        onSuccess: (res) => {
          if (type === "upload") {
            mutate(`${baseurl}/assignment/files/${assignmentId}`);
          } else {
            setFiles((files) => {
              const att: Attachment = {
                fakeId: res.data,
                type: "VIDEO",
                doc: { type: "VIDEO", id: res.data },
              };
              if (!files) return [att];
              return [...files, att];
            });
          }
        },
      }
    );
  };

  const handleFileSave = async () => {
    if (!files) return;
    executeQuery(
      async () => {
        const data = new FormData();
        files.forEach((file) => {
          if (file.type === "FILE") data.append("files", file.file!);
          if (file.type === "LINK") data.append("links", file.link!);
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
        onSuccess: () => mutate(`${baseurl}/assignment/files/${assignmentId}`),
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
        {file.type === "FILE" && file.file?.name}
        {file.type === "LINK" && file.link}
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
          <p className="font-[600] uppercase">{t("add-attach")}</p>
        </div>
        {dropdown && (
          <FileOptions
            onClose={() => setDropdown(false)}
            setFiles={setFiles}
            handleCreateDoc={handleCreateDoc}
            handleCreateVideo={handleCreateVideo}
            t={t}
          />
        )}
      </div>
      <section
        className={`flex flex-wrap w-full h-full max-h-[14rem] items-center justify-center overflow-auto mb-3 ${
          style === "bottom" ? "order-last" : "order-first"
        }`}
        id="journal-scroll"
      >
        {mapFiles}
      </section>
      {type === "upload" && (
        <button
          className="btn btn-outline btn-sm mt-3 w-64"
          onClick={handleFileSave}
          aria-label="Upload Files"
        >
          {t("upload-file")}
        </button>
      )}
    </div>
  );
}

const FileOptions = ({
  onClose,
  setFiles,
  handleCreateDoc,
  handleCreateVideo,
  t,
}: {
  onClose: () => void;
  setFiles: React.Dispatch<SetStateAction<Attachment[] | undefined>>;
  handleCreateDoc: () => Promise<void>;
  handleCreateVideo: () => Promise<void>;
  t: TFunction;
}) => {
  const { pushModal, closeModal } = useModals();

  const ref = useRef(null);

  useOnOutsideClick(ref, onClose);

  const handleAddFile = (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleAddLink = () => {
    const akey = `linkm#${Date.now()}`;
    pushModal(
      <AddLink
        onClose={() => closeModal(akey)}
        setFiles={setFiles}
        label={t("add-link")}
        key={akey}
      />,
      {
        timer: false,
      }
    );
  };

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
          onChange={handleAddFile}
        />
        <BsPaperclip size={18} className="mx-4" />
        <h4>{t("file", { ns: "common" })}</h4>
      </label>
      <div
        className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer"
        onClick={handleAddLink}
      >
        <BsLink size={18} className="mx-4" />
        <h4>{t("link", { ns: "common" })}</h4>
      </div>
      <div className="border-b border-gray-400 w-full my-1"></div>
      <h3 className="p-2 text-sm font-semibold text-gray-500">Create</h3>
      <div
        className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer"
        onClick={handleCreateDoc}
      >
        <GrDocumentText size={16} className="mx-4" />
        <h4>{t("document", { ns: "common" })}</h4>
      </div>
      <div
        className="flex flex-row items-center w-full hover:bg-gray-200 py-1 cursor-pointer"
        onClick={handleCreateVideo}
      >
        <AiOutlineVideoCameraAdd size={16} className="mx-4" />
        <h4>{t("video", { ns: "common" })}</h4>
      </div>
    </div>
  );
};

const AddLink = ({
  onClose,
  setFiles,
  label,
}: {
  onClose: () => void;
  setFiles: Dispatch<SetStateAction<Attachment[] | undefined>>;
  label: string;
}) => {
  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, onClose);
  const [link, setLink] = useState("");

  const handleAction = () => {
    if (!(link.length > 0)) return;

    setFiles((files) => {
      const linkAtt: Attachment = { fakeId: uniqueId(), type: "LINK", link };
      if (!files) return [linkAtt];
      return [...files, linkAtt];
    });
    onClose();
  };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white max-h-[60%]">
            <h2 className="font-semibold label">{label}</h2>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <section className="flex flex-col px-6 py-5 bg-gray-50">
            <label>{label}</label>
            <input
              type="text"
              value={link}
              className="input input-bordered border border-gray-200 rounded w-full shadow-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setLink(e.target.value);
              }}
            />
            <button className="btn btn-outline mt-4" onClick={handleAction}>
              {label}
            </button>
          </section>
        </div>
      </div>
    </Modal>
  );
};
