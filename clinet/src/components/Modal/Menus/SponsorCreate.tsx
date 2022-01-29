import { useRef, useState } from "react";
import Modal from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { Sponsor } from "../../../interfaces";
import { CloseIcon } from "../../../svg/small";
import ImageSelector from "../../Inputs/ImageSelector";

export default function SponsorCreate({
  onClose,
  setSponsors,
}: {
  onClose: Function;
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[] | undefined>>;
}) {
  const wrapperRef = useRef(null);

  const [name, setName] = useState<string>();
  const [image, setImage] = useState<File>();

  useOnOutsideClick(wrapperRef, () => onClose());

  //   const sendRequst = async () => {
  //     setSponsors((sponsors) => {
  //       console.log(sponsors);
  //       console.log("HEREEE");

  //       return [
  //         {
  //           name: `name`,
  //           preview: `http://localhost:5000/api/user/avatars/alexspx.jpg`,
  //         },
  //         {
  //           name: `name`,
  //           preview: `http://localhost:5000/api/user/avatars/alexspx.jpg`,
  //         },
  //         {
  //           name: `name`,
  //           preview: `http://localhost:5000/api/user/avatars/alexspx.jpg`,
  //         },
  //       ];
  //     });
  //     onClose();
  //   };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white">
            <span className="font-semibold label">Add a sponsor</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex w-full items-center justify-center mt-2">
            <div className="flex h-24 w-24">
              <ImageSelector
                image={image}
                setImage={setImage}
                shape="square"
                label="Logo"
              />
            </div>
          </div>
          <div className="flex flex-col px-6 py-5 bg-gray-50">
            <label className="label">
              <span className="label-text">Sponsor&apos;s Name</span>
            </label>
            <input
              type="text"
              placeholder={`Sponsor's name`}
              className="input input-bordered border border-gray-200 rounded shadow-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setName(e.target.value);
              }}
            />
            {/* {error && (
              <div className="flex w-full my-1 items-center justify-center text-red-600 font-semibold">
                Error: {error}
              </div>
            )} */}
            <button
              className="btn btn-outline my-2"
              onClick={() =>
                setSponsors([
                  {
                    name: "asd",
                    preview:
                      "http://localhost:5000/api/user/avatars/alexspx.jpg",
                  },
                ])
              }
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
