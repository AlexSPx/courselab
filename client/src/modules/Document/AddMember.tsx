import { useRef } from "react";
import Modal from "../../components/Modal";
import Searchbar from "./Searchbar";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";
import { DocumentInterface } from "../../interfaces";
import { CloseIcon } from "../../svg/small";

export default function AddMember({
  onClose,
  document,
}: {
  onClose: Function;
  document: DocumentInterface;
}) {
  const wrapperRef = useRef(null);

  useOnOutsideClick(wrapperRef, () => onClose());

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-400 bg-opacity-[.05] z-10">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white">
            <span className="font-semibold label">Add Member</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="p-4">
            <Searchbar document={document} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
