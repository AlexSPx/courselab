import axios from "axios";
import { useState } from "react";
import FIleAdder from "../../components/FIleAdder";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { Left, Main, Right } from "../Layouts/MainLayout";
import useRequest from "../../lib/useRequest";
import { Quill } from "quill";

import dynamic from "next/dynamic";
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

  const [quill, setQuill] = useState<Quill>();

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

  const mapFiles = assignment.files.map((file) => {
    return (
      <a
        className="flex px-3 py-2 m-1 font-mono rounded border border-gray-900 hover:bg-gray-900 hover:text-white cursor-pointer"
        key={file}
        href={`${baseurl}/assignment/download/${file}`}
        download
      >
        {file}
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
