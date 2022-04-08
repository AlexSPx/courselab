import { useTranslation } from "next-i18next";
import { Dispatch, SetStateAction } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import useRightClickContext from "../../contexts/RightClickMenuContext";
import { QuizzQuestionInterface } from "../../interfaces";
import ClosedQuestionModal from "../../modules/QuizEditor/ClosedQuestionModal";
import OpenedQuestionModal from "../../modules/QuizEditor/OpenedQuestionModal";
import { useModals } from "../Modal";

export default function QuizMenu({
  outerRef,
  setQuestions,
}: {
  outerRef: React.RefObject<HTMLDivElement>;
  setQuestions: Dispatch<SetStateAction<QuizzQuestionInterface[]>>;
}) {
  const { x, y, visible } = useRightClickContext(outerRef);

  const { pushModal, closeModal } = useModals();
  const { t } = useTranslation("docs");
  const handleOpenMCM = () => {
    const mkey = Date.now();

    pushModal(
      <ClosedQuestionModal
        key={mkey}
        onClose={() => closeModal(mkey)}
        setQuestions={setQuestions}
        t={t}
      />,
      { timer: false }
    );
  };

  const handleOpenOEM = () => {
    const mkey = Date.now();

    pushModal(
      <OpenedQuestionModal
        key={mkey}
        onClose={() => closeModal(mkey)}
        setQuestions={setQuestions}
        t={t}
      />,
      { timer: false }
    );
  };

  if (visible) {
    return (
      <div
        className="absolute bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-2  text-gray-500 shadow-lg z-10"
        style={{ top: y, left: x }}
      >
        <div
          className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer items-center"
          onClick={handleOpenMCM}
        >
          <IoIosAdd size={24} className="mx-1 text-gray-900" />

          <div>{t("mcq")}</div>
          <div
            className="tooltip tooltip-right"
            data-tip={t("multichoice-tooltip")}
          >
            <BsFillQuestionCircleFill size={16} className="mx-1 rounded-full" />
          </div>
        </div>
        <div
          className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer items-center"
          onClick={handleOpenOEM}
        >
          <IoIosAdd size={24} className="mx-1 text-gray-900" />

          <div>{t("oeq")}</div>
          <div
            className="tooltip tooltip-right"
            data-tip={t("open-ended-tooltip")}
          >
            <BsFillQuestionCircleFill size={16} className="mx-1 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
