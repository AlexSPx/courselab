import axios from "axios";
import { NextRouter } from "next/dist/client/router";
import { useState } from "react";
import useHasImage from "../../Hooks/useHasImage";
import { CourseInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../../components/Modal";
import ImageSelector from "../../components/Inputs/ImageSelector";

export default function GeneralSettings({
  course,
  router,
}: {
  course: CourseInterface;
  router: NextRouter;
}) {
  const [description, setDescription] = useState(course.details.description);
  const [name, setName] = useState(course.name);
  const [publicName, setPublicName] = useState(course.public_name);
  const [image, setImage] = useState<File | undefined>();

  const { url } = useHasImage(`${course.name}`, { type: "course_logo" });

  const { pushModal, closeModal } = useModals();

  const saveChanges = async () => {
    const ackey = Date.now();

    const changesForm = new FormData();

    console.log(course.name);

    changesForm.append("name", name);
    changesForm.append("public_name", publicName);
    changesForm.append("description", description);
    changesForm.append("courseName", course.name);
    changesForm.append("old_name", course.name);
    if (image) changesForm.append("image", image);

    pushModal(
      <LoadingModal
        key={ackey}
        title="Saveing Changes..."
        body="This might take a bit"
      />,
      { timer: false }
    );
    try {
      const changesRes = await axios.post(
        `${baseurl}/course/savechanges`,
        changesForm,
        { withCredentials: true }
      );

      if (changesRes.status === 201) {
        router.push(name);
        closeModal(ackey);
        pushModal(
          <SuccessModal
            title={`Changes: ${course.public_name}`}
            body="Changes - saved"
          />,
          {
            value: 3000,
          }
        );
      } else {
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

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-2xl font-bold">{publicName} - Editor</p>
      <div className="flex flex-col w-3/4 font-semibold">
        <div className="flex flex-row w-full">
          <div className="form-control w-full mx-3">
            <label className="label">
              <span className="label-text">Course Public Name</span>
            </label>
            <input
              type="text"
              value={publicName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPublicName(e.target.value)
              }
              className="input input-bordered"
            />
          </div>
          <div className="form-control w-full mx-3">
            <label className="label">
              <span className="label-text">Course Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setName(e.target.value)
              }
              className="input input-bordered"
            />
          </div>
        </div>

        <div className="flex flex-row w-full mt-3">
          <div className="form-control w-1/2 mb-3 mx-3">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea h-36 textarea-bordered"
              placeholder="Bio"
              defaultValue={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <label className="label">
              <span className="label-text">Course Image</span>
            </label>
            <div className="relative w-32 h-32 rounded-xl border cursor-pointer overflow-hidden">
              <ImageSelector
                image={image}
                setImage={setImage}
                previewN={url}
                shape="square"
              />
            </div>
          </div>
        </div>
      </div>
      <a className="btn max-w-2xl w-full mt-3" onClick={() => saveChanges()}>
        Save Chanes
      </a>
    </div>
  );
}
