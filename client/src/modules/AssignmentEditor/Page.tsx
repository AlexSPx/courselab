import axios from "axios";
import { useState } from "react";
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

export default function Page({
  assignment,
}: {
  assignment: AssignmentInterface;
}) {
  const [name, setName] = useState<string>(assignment.name);
  const [content, setContent] = useState(assignment.content);

  const { pushModal, closeAll } = useModals();

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
          content,
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
          className="label text-center px-7 font-semibold text-2xl border-b-2 border-gray-800"
          value={name}
          onChange={(e: React.ChangeEvent<any>) => {
            setName(e.target.value);
          }}
        />
        <textarea
          className="w-4/5 textarea textarea-bordered mt-3"
          value={content}
          onChange={(e: React.ChangeEvent<any>) => {
            setContent(e.target.value);
          }}
        />

        <p className="divider w-full text-lg font-semibold my-8 sm:w-4/5">
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
