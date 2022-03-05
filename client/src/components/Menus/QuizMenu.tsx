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

  const handleOpenMCM = () => {
    const mkey = Date.now();

    pushModal(
      <ClosedQuestionModal
        key={mkey}
        onClose={() => closeModal(mkey)}
        setQuestions={setQuestions}
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

          <div>Multiple choice question</div>
          <div
            className="tooltip tooltip-right"
            data-tip="Multiple choice questions are fundamental survey questions which provides respondents with multiple answer options.(A, B, C, D)"
          >
            <BsFillQuestionCircleFill size={16} className="mx-1 rounded-full" />
          </div>
        </div>
        <div
          className="flex hover:bg-gray-100 py-1 px-2 cursor-pointer items-center"
          onClick={handleOpenOEM}
        >
          <IoIosAdd size={24} className="mx-1 text-gray-900" />

          <div>Open-Ended question</div>
          <div
            className="tooltip tooltip-right"
            data-tip="Open-ended questions are questions that cannot be answered with a simple 'yes' or 'no', and instead require the respondent to elaborate on their points."
          >
            <BsFillQuestionCircleFill size={16} className="mx-1 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
