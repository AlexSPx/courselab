import { uniqueId } from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import Modal from "../../components/Modal";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";
import { QuizzQuestionInterface } from "../../interfaces";
import { CloseIcon } from "../../svg/small";

const onlyNumbers = /^[0-9\b]+$/;

export default function OpenedQuestionModal({
  onClose,
  setQuestions,
  editData,
}: {
  onClose: Function;
  setQuestions: Dispatch<SetStateAction<QuizzQuestionInterface[]>>;
  editData?: QuizzQuestionInterface;
}) {
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>();
  const [points, setPoints] = useState(editData?.points ? editData?.points : 0);

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, () => onClose());

  useEffect(() => {
    if (!editData) return;
    setQuestion(editData.question);
    setAnswer(editData.answer[0]);
  }, [editData]);

  const handleCreate = () => {
    if (!question || !answer) return;

    setQuestions((questions) => {
      const t: QuizzQuestionInterface = {
        id: editData ? editData.id : uniqueId(),
        question,
        points,
        answer: [answer],
        options: [],
        type: "OPENED",
        orderIndex: editData ? editData.orderIndex : questions.length,
      };
      if (!questions) return [t];
      if (editData) return questions.map((q) => (q.id === t.id ? t : q));
      else return [...questions, t];
    });
    onClose();
  };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white">
            <span className="font-semibold label">
              Create a new Open-Choice question
            </span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col px-6 py-3 bg-gray-50">
            <label className="label pt-0">
              <span className="label-text">Question</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={question || ""}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <span className="label-text mt-1">Points</span>
            <input
              type="text"
              className="input input-sm input-bordered mt-1"
              value={points}
              onChange={(e) => {
                if (e.target.value === "" || onlyNumbers.test(e.target.value)) {
                  setPoints(parseInt(e.target.value));
                } else {
                  setPoints(0);
                }
              }}
            />
            <label className="label pt-0 mt-2 flex justify-between">
              <span className="label-text">Answer</span>
              <div
                className="tooltip tooltip-right"
                data-tip="If the provided answer below does not exactly match the user input, they will not get any points. It is recommended to manually check them after each quiz."
              >
                <BsFillQuestionCircleFill size={16} className="rounded-full" />
              </div>
            </label>
            <input
              className="input input-bordered"
              value={answer || ""}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button
              className="btn btn-sm mt-2"
              onClick={handleCreate}
              aria-label={!editData ? "Create" : "Edit"}
            >
              {!editData ? "Create" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
