import axios from "axios";
import { useState } from "react";
import FIleAdder from "../../components/FIleAdder";
import { AssignmentInterface } from "../../interfaces";
import { baseurl, fetcher } from "../../lib/fetcher";
import { Left, Main, Right } from "../Layouts/MainLayout";
import useRequest from "../../lib/useRequest";
import { Quill } from "quill";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import useSWR from "swr";
import { DocumentIcon, VideoIcon } from "../../svg/small";
const DescriptionSection = dynamic(() => import("./DescriptionSection"), {
  ssr: false,
});

const re = /^[1-9\b]+$/;

export default function Page({
  assignment,
}: {
  assignment: AssignmentInterface;
}) {
  const [name, setName] = useState<string>(assignment.name);
  const [daysToSubmit, setDaysToSubmit] = useState<string | undefined>(
    assignment.daysToSubmit ? assignment.daysToSubmit.toString() : undefined
  );
  const [files, setFiles] = useState(assignment.files);
  const [quill, setQuill] = useState<Quill>();

  useSWR(`${baseurl}/assignment/files/${assignment.id}`, {
    onSuccess: (data) => setFiles(data.files),
  });

  const { executeQuery } = useRequest();

  const handleSaveChanges = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/assignment/save`,
          {
            assignmentId: assignment.id,
            name,
            daysToSubmit,
            content: quill?.getContents(),
          },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Saving changes",
        successBody: "Changes have been saved",
      }
    );
  };

  const handleDeleteAssignment = async () => {
    executeQuery(
      async () => {
        const res = await axios.delete(
          `${baseurl}/assignment/${assignment.id}`,
          {
            withCredentials: true,
          }
        );

        return res;
      },
      {
        loadingTitle: "Deleting changes",
        successTitle: "Deleted",
        successBody: "Assignment has been deleted",
      }
    );
  };

  const mapFiles = files.map((file) => {
    const name = file.split("{-divide-}")[2];
    const type = file.split("{-divide-}")[0];
    if (type === "link") {
      return (
        <Link href={name} passHref={true} key={file}>
          <a
            className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white items-center cursor-pointer"
            target="_blank"
          >
            <AiOutlineLink size={18} className="mr-1" />
            {name}
          </a>
        </Link>
      );
    }
    if (type === "doc" || type === "video") {
      return <Attachment type={type} id={name} />;
    }
    return (
      <a
        className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
        key={file}
        href={`${baseurl}/assignment/download/${file}`}
        download
      >
        {name}
      </a>
    );
  });

  return (
    <>
      <Left></Left>
      <Main css="items-center">
        <input
          className="label text-center px-7 font-semibold text-2xl border-b-2 border-gray-800 w-full overflow-hidden"
          value={name}
          onChange={(e: React.ChangeEvent<any>) => {
            setName(e.target.value);
          }}
        />
        <DescriptionSection
          quill={quill}
          setQuill={setQuill}
          contents={assignment.content}
        />
        <section className="flex flex-wrap">{mapFiles}</section>
        <h3 className="divider w-full text-lg font-semibold my-8">
          Days to submit
        </h3>

        <input
          type="text"
          className="input input-bordered w-[24rem] py-3"
          placeholder="Input number in days"
          value={daysToSubmit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            if (e.target.value === "" || re.test(e.target.value)) {
              setDaysToSubmit(e.target.value);
            }
          }}
        />
        <h3 className="divider w-full text-lg font-semibold my-8">
          Attach files
        </h3>
        <FIleAdder type="upload" assignmentId={assignment.id} />

        <section className="flex flex-row">
          <button
            className="mt-8 btn btn-outline mx-2 w-96"
            onClick={handleSaveChanges}
            aria-label="Save changes"
          >
            Save Changes
          </button>
          <button
            className="mt-8 btn btn-outline border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500 mx-2 w-64"
            onClick={handleDeleteAssignment}
            aria-label="delete assignment"
          >
            Delete Assignment
          </button>
        </section>
      </Main>
      <Right></Right>
    </>
  );
}

export const Attachment = ({ type, id }: { type: string; id: string }) => {
  const [name, setName] = useState("");
  useSWR(`${baseurl}/assignment/file/name/${type}/${id}`, {
    onSuccess: (data) => setName(data.name),
  });

  return (
    <Link href={`/${type}/${id}`} passHref={true} key={id}>
      <a
        className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white items-center cursor-pointer"
        target="_blank"
      >
        {type === "doc" ? (
          <DocumentIcon css="mr-1" />
        ) : (
          <VideoIcon css="mr-1" />
        )}
        {name}
      </a>
    </Link>
  );
};
