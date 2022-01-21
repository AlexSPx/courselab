import React, { useState } from "react";
import { Left, Main, Right } from "../Layouts/MainLayout";
import ImageSelector from "../../components/Inputs/ImageSelector";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../../components/Modal";
import axios from "axios";
import { baseurl } from "../../lib/fetcher";
import { CourseInterface } from "../../interfaces";
import CourseDraftCard from "../../components/cards/CourseDraftCard";
import { useSWRConfig } from "swr";

export default function Page({ drafts }: { drafts: CourseInterface[] }) {
  const [name, setName] = useState("");
  const [publicName, setPublicName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();

  const { pushModal, closeModal, closeAll } = useModals();
  const { mutate } = useSWRConfig();

  const createCourse = async () => {
    closeAll();
    if (!name || !publicName || !description || !description) {
      pushModal(<ErrorModal title="Error" body="Missing arguments" />);
    }
    const ackey = Date.now();
    pushModal(
      <LoadingModal
        key={ackey}
        title="Creating a new course"
        body="This might take a bit"
      />,
      { timer: false }
    );
    try {
      const courseData = new FormData();
      courseData.append("name", name);
      courseData.append("public_name", publicName);
      courseData.append("description", description);
      if (image) courseData.append("image", image);

      const response = await axios.post(
        `${baseurl}/course/create`,
        courseData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        closeModal(ackey);
        pushModal(
          <SuccessModal
            title="Course has been created"
            body="A new course draft has been created"
          />,
          {
            value: 3000,
          }
        );

        mutate(`${baseurl}/course/mydrafts`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          closeModal(ackey);
          pushModal(<ErrorModal title="Error" body={error.response.data} />);
        }
      } else {
        pushModal(
          <ErrorModal title="Error" body="An unexpected error has occurred" />
        );
      }
    }
  };

  const mapDrafts = drafts?.map((draft) => {
    return <CourseDraftCard draft={draft} key={draft.name} />;
  });

  return (
    <Main css="items-center">
      <div className="divider max-w-2xl w-full italic">Drafts</div>
      <div className="flex flex-row">{mapDrafts}</div>
      <div className="divider max-w-2xl w-full italic">Create a Course</div>

      <div className="flex flex-col max-w-2xl w-full md:w-3/5"></div>

      <div className="flex flex-col md:flex-row max-w-2xl w-full lg:w-3/5 items-center justify-center">
        <div className="flex flex-col relative w-56 h-32 mr-3">
          <ImageSelector
            image={image}
            setImage={setImage}
            label="Select an Image"
            shape="square"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Public Name</span>
            </label>
            <input
              type="text"
              placeholder="Public Name"
              value={publicName}
              className="input input-bordered"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPublicName(e.target.value)
              }
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              className="input input-bordered"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setName(e.target.value)
              }
            />
            <span className="label">
              <span className="label-text-alt flex w-full justify-between">
                <p>Must be uniqe</p>
                <p>{`htts://courselab.xyz/course/${name}`}</p>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="form-control max-w-2xl w-full lg:w-3/5 mb-3">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className="textarea h-24 textarea-bordered"
          placeholder="Bio"
          defaultValue={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="btn max-w-2xl w-full md:w-3/5" onClick={createCourse}>
        Create a Draft
      </div>
    </Main>
  );
}
