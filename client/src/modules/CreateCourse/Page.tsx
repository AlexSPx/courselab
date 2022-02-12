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
import useRequest from "../../lib/useRequest";

export default function Page({ drafts }: { drafts: CourseInterface[] }) {
  const [name, setName] = useState("");
  const [publicName, setPublicName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();

  const { executeQuery } = useRequest();
  const { mutate } = useSWRConfig();

  const createCourse = async () => {
    const courseData = new FormData();
    courseData.append("name", name);
    courseData.append("public_name", publicName);
    courseData.append("description", description);
    if (image) courseData.append("image", image);

    executeQuery(
      async () => {
        const res = await axios.post(`${baseurl}/course/create`, courseData, {
          withCredentials: true,
        });
        return res;
      },
      {
        loadingTitle: "Creating your course...",
        successTitle: "Course has been created",
        successBody: "A new course draft has been created",
        successStatus: 201,
        onSuccess: () => mutate(`${baseurl}/course/mydrafts`),
      }
    );
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
