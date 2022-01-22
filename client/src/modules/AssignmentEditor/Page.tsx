import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import FIleAdder from "../../components/FIleAdder";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../../components/Modal";
import { AssignmentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { Left, Main, Right } from "../Layouts/MainLayout";
import Quill from "quill";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
];

export default function Page({
  assignment,
}: {
  assignment: AssignmentInterface;
}) {
  const [name, setName] = useState<string>(assignment.name);

  const [quill, setQuill] = useState<Quill>();

  const { pushModal, closeAll } = useModals();

  useEffect(() => {
    if (!quill) return;

    quill.setContents(JSON.parse(assignment.content));
  }, [assignment.content, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement) => {
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
  }, []);

  const handleSaveChanges = async () => {
    try {
      pushModal(<LoadingModal title="Saving chnages" body="Almost done..." />, {
        timer: false,
      });

      const res = await axios.post(
        `${baseurl}/assignment/save`,
        {
          assignmentId: assignment.id,
          name,
          content: JSON.stringify(quill?.getContents()),
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        closeAll();
        pushModal(
          <SuccessModal title="Success" body="Changes have been saved" />
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeAll();
          pushModal(<ErrorModal title="Error" body={error.response.data} />);
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      pushModal(
        <LoadingModal title="Deliting..." body="This might take a bit" />,
        {
          timer: false,
        }
      );

      const res = await axios.delete(`${baseurl}/assignment/${assignment.id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        closeAll();
        pushModal(
          <SuccessModal title="Deleted" body="Assignment has been deleted" />
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeAll();
          pushModal(<ErrorModal title="Error" body={error.response.data} />);
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

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
        <div
          ref={wrapperRef}
          className="w-full h-full min-h-[10em] border border-gray-800 rounded-md mt-2"
        ></div>

        <p className="divider w-full text-lg font-semibold my-8">
          Attach a File
        </p>
        <FIleAdder type="" />

        <div className="flex flex-row">
          <button
            className="mt-8 btn btn-outline mx-2 w-96"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="mt-8 btn btn-outline border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500 mx-2 w-64"
            onClick={handleDeleteAssignment}
          >
            Delete Assignment
          </button>
        </div>
      </Main>
      <Right></Right>
    </>
  );
}
