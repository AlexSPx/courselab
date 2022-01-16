import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "../../contexts/ModalContex";
import { CheckIcon, ErrorIcon, LoadingFlexCenter } from "../../svg/small";

const Modal: React.FC<{}> = ({ children }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modal = <>{children}</>;

  if (isBrowser) {
    return createPortal(
      modal,
      document.getElementById("modals") as HTMLElement
    );
  } else {
    return null;
  }
};

export const useModals = () => {
  const modalContext = useContext(ModalContext);

  const pushModal = (
    modal: JSX.Element,
    { timer = true, value = 2000 }: { timer?: boolean; value?: number } = {}
  ) => {
    modalContext?.setModals((modals: JSX.Element[]) => [...modals, modal]);

    if (timer) {
      setTimeout(() => {
        modalContext?.setModals((current) =>
          current.filter((cr) => cr.key !== modal.key)
        );
      }, value);
    }
  };

  const closeModal = (key: number | string) => {
    modalContext?.setModals((current) =>
      current.filter((cr) => cr.key !== key.toString())
    );
  };

  const closeAll = () => {
    modalContext?.setModals([]);
  };

  return { pushModal, closeModal, closeAll };
};

export const ErrorModal = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  return (
    <Modal key={Date.now()}>
      <div className="z-50 flex px-5 flex-row items-center shadow-lg rounded-xl w-full md:w-96 h-24 bg-white border border-red-600 dark:bg-gray-800 relative overflow-hidden m-1">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ErrorIcon />
        </div>
        <div className="flex flex-col justify-center mx-3">
          <p className="text-lg">{title}</p>
          <p className="text-sm">{body}</p>
        </div>
      </div>
    </Modal>
  );
};

export const SuccessModal = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  return (
    <Modal key={Date.now()}>
      <div className="z-50 flex px-5 flex-row items-center shadow-lg rounded-xl w-full md:w-96 h-24 bg-white border border-green-600 dark:bg-gray-800 relative overflow-hidden m-1">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
          <CheckIcon />
        </div>
        <div className="flex flex-col justify-center mx-3">
          <p className="text-lg">{title}</p>
          <p className="text-sm">{body}</p>
        </div>
      </div>
    </Modal>
  );
};

export const LoadingModal = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  return (
    <Modal key={Date.now()}>
      <div className="z-50 flex px-5 flex-row items-center shadow-lg rounded-xl w-full md:w-96 h-24 bg-white border border-yellow-400 dark:bg-gray-800 relative overflow-hidden m-1">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
          <LoadingFlexCenter css="h-5 w-5 border-yellow-200 loaderY" />
        </div>
        <div className="flex flex-col justify-center mx-3">
          <p className="text-lg">{title}</p>
          <p className="text-sm">{body}</p>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
