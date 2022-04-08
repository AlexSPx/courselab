import { uniqueId } from "lodash";
import { TFunction } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Modal from "../../components/Modal";
import useDebounce from "../../Hooks/useDebounce";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";
import { QuizzQuestionInterface } from "../../interfaces";
import { CloseIcon } from "../../svg/small";

const onlyNumbers = /^[0-9\b]+$/;

export default function ClosedQuestionModal({
  onClose,
  setQuestions,
  editData,
  t,
}: {
  onClose: Function;
  setQuestions: Dispatch<SetStateAction<QuizzQuestionInterface[]>>;
  editData?: QuizzQuestionInterface;
  t: TFunction;
}) {
  const [question, setQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<string[] | null>(null);
  const [points, setPoints] = useState(editData?.points ? editData?.points : 0);
  const [answer, setAnswer] = useState<string[]>([]);

  useEffect(() => {
    if (!editData) return;
    setQuestion(editData.question);
    setOptions(editData.options);
    setAnswer(editData.answer);
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer([e.target.value]);
  };

  const mapOptions = options?.map((opt, index) => {
    return (
      <Option
        key={index}
        opt={opt}
        index={index}
        answer={answer}
        handleChange={handleChange}
        setOptions={setOptions}
      />
    );
  });

  const wrapperRef = useRef(null);

  useOnOutsideClick(wrapperRef, () => onClose());

  const handleCreate = () => {
    if (!question || !answer || !options) return;

    setQuestions((questions) => {
      const t: QuizzQuestionInterface = {
        id: editData ? editData.id : uniqueId(),
        question,
        options,
        answer: answer,
        type: "CLOSED",
        points,
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
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white">
            <span className="font-semibold label">{t("closed-choice")}</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col px-6 py-3 bg-gray-50">
            <label className="label pt-0">
              <span className="label-text">{t("question")}</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={question || ""}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <span className="label-text mt-1">{t("points")}</span>
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
            {mapOptions}
            <button
              className="btn btn-outline btn-sm mt-2"
              onClick={() =>
                setOptions((opts) => {
                  if (!opts) return [""];
                  return [...opts, ""];
                })
              }
              aria-label="add an option"
            >
              {t("add-option")}
            </button>
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

const Option = ({
  opt,
  index,
  answer,
  setOptions,
  handleChange,
}: {
  opt: string;
  index: number;
  answer: string[];
  setOptions: Dispatch<SetStateAction<string[] | null>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [value, setValue] = useState(opt);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    setOptions((opts) => {
      if (!opts) return null;
      return opts.map((opt, idx) => (idx === index ? value : opt));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <label className="cursor-pointer flex items-center" key={opt}>
      <input
        type="radio"
        name="opt"
        className="radio"
        checked={answer[0] === opt ? true : false}
        value={opt}
        onChange={handleChange}
      />
      <input
        className="input input-bordered input-xs w-full mx-2 my-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
};
