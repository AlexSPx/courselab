import axios from "axios";
import { filter, isEqual, isObject, size, transform } from "lodash";
import { CSSProperties, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { AiOutlineEdit } from "react-icons/ai";
import QuizMenu from "../../components/Menus/QuizMenu";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../../components/Modal";
import { QuizInterface, QuizzQuestionInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import useRequest from "../../lib/useRequest";
import { Left, Right, Main } from "../Layouts/MainLayout";
import ClosedQuestionModal from "./ClosedQuestionModal";
import OpenedQuestionModal from "./OpenedQuestionModal";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: any
): CSSProperties => ({
  userSelected: "none",
  background: isDragging ? "rgb(243 244 246)" : "rgb(249 250 251)",
  "background:hover": "rgb(243 244 246)",
  ...draggableStyle,
});

export default function Page({ quiz }: { quiz: QuizInterface }) {
  const [winReady, setWinReady] = useState(false);
  const [name, setName] = useState(quiz.name);
  const [description, setDescription] = useState(quiz.description);
  const [questions, setQuestions] = useState(
    quiz.questions.sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1))
  );

  const [hasChanges, setHasChanges] = useState(false);

  const questionsWrapperRef = useRef(null);

  const { pushModal, closeModal } = useModals();
  const { executeQuery } = useRequest();

  useEffect(() => {
    setWinReady(true);
  }, []);

  useEffect(() => {
    setHasChanges(isEqual(quiz.questions, questions));
  }, [questions, quiz.questions]);

  const mapQuestions = questions.map((question, index) => {
    if (question.type === "CLOSED") {
      const handleEdit = () => {
        const akey = `${index}#${Date.now}`;
        pushModal(
          <ClosedQuestionModal
            key={akey}
            onClose={() => closeModal(akey)}
            setQuestions={setQuestions}
            editData={question}
          />,
          { timer: false }
        );
      };

      return (
        winReady && (
          <MultiChoiceQuestion
            key={`${index}-${Date.now}`}
            question={question}
            index={index}
            handleEdit={handleEdit}
          />
        )
      );
    } else if (question.type === "OPENED") {
      const handleEdit = () => {
        const akey = `${index}#${Date.now}`;
        pushModal(
          <OpenedQuestionModal
            key={akey}
            onClose={() => closeModal(akey)}
            setQuestions={setQuestions}
            editData={question}
          />,
          { timer: false }
        );
      };
      return (
        winReady && (
          <OpenEndedQuestion
            key={`${index}-${Date.now}`}
            question={question}
            index={index}
            handleEdit={handleEdit}
          />
        )
      );
    }
  });

  const reorder = (
    list: QuizzQuestionInterface[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const q = reorder(questions, result.source.index, result.destination.index);

    setQuestions(q);
  };

  const handleSaveChanges = async () => {
    executeQuery(
      async () => {
        setQuestions(
          questions.map((question, index) => {
            question.orderIndex = index;
            return question;
          })
        );
        const diff = difference(questions as any, quiz.questions as any);
        const res = await axios.post(
          `${baseurl}/quiz/questions`,
          { quizId: quiz.id, questions: filter(diff, size) },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingTitle: "Saving Changes",
        loadingBody: "Please wait",
        successBody: "Changes have been saved",
      }
    );
  };

  const handleGeneralSettings = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/quiz/changes`,
          { id: quiz.id, data: { name, description } },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingTitle: "Saving Changes",
        loadingBody: "Please wait",
        successBody: "Changes have been saved",
      }
    );
  };

  const handleDelete = async () => {
    executeQuery(
      async () => {
        const res = await axios.delete(`${baseurl}/quiz/${quiz.id}`, {
          withCredentials: true,
        });
        return res;
      },
      {
        loadingTitle: "Deleting...",
        loadingBody: "Please wait",
        successBody: "Quiz has been deleted",
      }
    );
  };
  return (
    <>
      <Left />
      <Main css="items-center">
        <div className="flex flex-col w-3/4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Course Public Name</span>
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
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Description"
              defaultValue={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-row justify-center">
            <button
              className="btn btn-outline my-4 mx-1 w-[45%]"
              onClick={handleGeneralSettings}
              aria-label="save general settings"
            >
              Save General Settings
            </button>
            <button
              className="btn btn-outline my-4 mx-1 w-[45%] border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500 hover:border-red-500"
              onClick={handleDelete}
              aria-label="delete quiz"
            >
              Delete Quiz
            </button>
          </div>
          {winReady && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div
                    className="flex flex-col w-full h-full border border-gray-400 rounded p-4"
                    ref={questionsWrapperRef}
                  >
                    <p className="py-4 text-xs opacity-60">
                      Right click to create questions
                    </p>
                    <QuizMenu
                      outerRef={questionsWrapperRef}
                      setQuestions={setQuestions}
                    />

                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {mapQuestions}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          {!hasChanges && (
            <button
              className="btn btn-outline my-1"
              onClick={handleSaveChanges}
              aria-label="save changes"
            >
              Save Changes
            </button>
          )}
        </div>
      </Main>
      <Right />
    </>
  );
}

const MultiChoiceQuestion = ({
  question,
  index,
  handleEdit,
}: {
  question: QuizzQuestionInterface;
  index: number;
  handleEdit: () => void;
}) => {
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.value === selected) setSelected(null);
  //   setSelected(e.target.value);
  // };

  const options = question.options?.map((option) => {
    return (
      <label className="cursor-pointer flex items-center" key={option}>
        <input
          type="radio"
          name="opt"
          className="radio"
          disabled={true}
          checked={option === question.answer[0] ? true : false}
          value={option}
        />
        <span className="label-text my-1 mx-3">{option}</span>
      </label>
    );
  });

  return (
    <Draggable
      draggableId={`${question.orderIndex}`}
      index={index}
      key={question.orderIndex}
    >
      {(provided, snapshot) => (
        <form
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          className="flex flex-col my-2 p-2 rounded bg-gray-50 hover:bg-gray-100 select-none relative group"
        >
          <button
            type="button"
            className="absolute top-0 right-0 items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-500 hover:text-white group-hover:flex"
            onClick={() => handleEdit()}
            aria-label="edit"
          >
            <AiOutlineEdit />
          </button>
          <p>{question.question}</p>
          <div className="form-control">{options}</div>
          <div
            className={`w-full border-b border-gray-400 my-3 ${
              snapshot.isDragging && "hidden"
            }`}
          ></div>
        </form>
      )}
    </Draggable>
  );
};

const OpenEndedQuestion = ({
  question,
  index,
  handleEdit,
}: {
  question: QuizzQuestionInterface;
  index: number;
  handleEdit: () => void;
}) => {
  return (
    <Draggable
      draggableId={`${question.orderIndex}`}
      index={index}
      key={question.orderIndex}
    >
      {(provided, snapshot) => (
        <form
          className="flex flex-col my-2 p-2 rounded bg-gray-50 hover:bg-gray-100 select-none relative group"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <button
            type="button"
            className="absolute top-0 right-0 items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-500 hover:text-white group-hover:flex"
            onClick={() => handleEdit()}
            aria-label="edit"
          >
            <AiOutlineEdit />
          </button>
          <p>{question.question}</p>
          <input
            type="text"
            className="input input-bordered my-1 disabled:bg-gray-200"
            disabled={true}
            value={question.answer[0]}
          />
          <div
            className={`w-full border-b border-gray-400 my-3 ${
              snapshot.isDragging && "hidden"
            }`}
          ></div>
        </form>
      )}
    </Draggable>
  );
};

export function difference(object: [], base: []) {
  return transform(object, (result: any, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = value;
    }
  });
}
