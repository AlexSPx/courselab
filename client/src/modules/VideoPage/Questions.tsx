import axios from "axios";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import {
  BiCommentDetail,
  BiDotsVerticalRounded,
  BiError,
} from "react-icons/bi";
import { BsFillCalendar2Fill } from "react-icons/bs";
import { IoMdTime, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ReactPlayer from "react-player";
import Avatar from "../../components/Avatar";
import { ErrorModal, SuccessModal, useModals } from "../../components/Modal";
import { UserContext } from "../../contexts/UserContext";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";
import { VideoInterface, VideoQuestion } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import secondsFormater from "../../lib/secondsFormater";

export default function Questions({
  video,
  playerRef,
}: {
  video: VideoInterface;
  playerRef: MutableRefObject<ReactPlayer | undefined>;
}) {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [content, setContent] = useState<string>();
  const [error, setError] = useState<string>();
  const [questions, setQuestions] = useState<VideoQuestion[]>(
    video.questions || []
  );

  const UserCtx = useContext(UserContext);
  const { pushModal } = useModals();

  const handleAddTimestamp = () => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    if (time === 0) return;
    setTimestamp(time);
  };

  console.log(questions);

  const handleAskQuestion = async () => {
    try {
      if (!content) {
        setError("No quesiton provided");
        setTimeout(() => setError(undefined), 6000);
        return;
      }
      const question = {
        authorId: UserCtx?.userData.user?.id,
        videoId: video.id,
        content,
        timestamp,
      };
      const res = await axios.post(`${baseurl}/video/question`, question, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setQuestions((qs) => [...qs, res.data]);
        pushModal(
          <SuccessModal
            title="Question posted"
            body="The question has been posted."
          />
        );
      }
    } catch (error) {
      pushModal(<ErrorModal title="Error" body={`${error}`} />);
    }
  };

  const renderQuestions = questions.map((question) => {
    if (!UserCtx?.userData.user?.id) return;
    return (
      <QuestionBlock
        question={question}
        currentUser={UserCtx?.userData.user?.id}
        videoId={video.id}
        playerRef={playerRef}
        key={question.id}
      />
    );
  });

  return (
    <div className="flex flex-col px-2">
      <p className="text-lg">Questions</p>
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-row items-center w-full">
          <button
            className="flex flex-row items-center justify-center text-sm my-1 mb-2 border-b hover:border-b-gray-800 hover:text-gray-900"
            onClick={handleAddTimestamp}
          >
            <IoMdTime />
            Timestamp
          </button>
          {timestamp && (
            <>
              <p className="mx-1">-</p>
              <div
                className="text-sm cursor-pointer tooltip"
                data-tip="click to reset"
                onClick={() => setTimestamp(null)}
              >
                {secondsFormater(timestamp)}
              </div>
            </>
          )}
        </div>
        <textarea
          className="textarea w-full border-gray-800"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setContent(e.target.value);
          }}
        />
        {error && (
          <div className="flex w-full items-center justify-center my-2">
            <div className="flex w-full justify-center items-center sm:w-4/5 bg-red-500 h-7 text-white rounded error font-thin text-lg">
              <BiError />
              {error}
            </div>
          </div>
        )}
        <button
          className="btn btn-sm btn-outline mt-1"
          onClick={handleAskQuestion}
        >
          Ask a question
        </button>
      </div>
      {renderQuestions}
    </div>
  );
}

const QuestionBlock = ({
  question,
  currentUser,
  videoId,
  playerRef,
}: {
  question: VideoQuestion;
  currentUser: string;
  videoId: string;
  playerRef: MutableRefObject<ReactPlayer | undefined>;
}) => {
  const [showResponses, setShowResponses] = useState(false);
  const [showReplay, setShowReplay] = useState(true);
  const [menu, setMenu] = useState(false);

  const [content, setContent] = useState<string>();
  const [error, setError] = useState<string>();
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [responses, setResponses] = useState(
    question.VideoAnswers.sort((value) => (value.is_answer ? -1 : 1))
  );

  const { pushModal } = useModals();

  const handleScrollTimestamp = () => {
    if (!question.timestamp) return;

    document.getElementById("player")?.scrollIntoView({ behavior: "smooth" });
    playerRef.current?.seekTo(question.timestamp);
  };

  const handleAddTimestamp = () => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    if (time === 0) return;
    setTimestamp(time);
  };

  const handleSendResponse = async () => {
    try {
      if (!content) {
        setError("No response provided");
        setTimeout(() => setError(undefined), 6000);
        return;
      }
      const response = {
        authorId: currentUser,
        videoId,
        content,
        parentQuestionId: question.id,
        timestamp,
      };
      const res = await axios.post(`${baseurl}/video/question`, response, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setResponses((ans) => [...ans, res.data]);
        pushModal(
          <SuccessModal
            title="Response posted"
            body={`Response to ${question.author.username} - posted.`}
          />
        );
      }
    } catch (error) {
      pushModal(<ErrorModal title="Error" body={`${error}`} />);
    }
  };

  const renderResponses = responses.map((response) => {
    return (
      <Response
        response={response}
        playerRef={playerRef}
        parentAuthorId={question.author.id}
        currentUser={currentUser}
        setResponses={setResponses}
        key={response.id}
      />
    );
  });

  const Menu = () => {
    const menuRef = useRef(null);
    useOnOutsideClick(menuRef, () => setMenu(false));

    return (
      <div
        className="origin-top-right absolute right-0 mt-5 mr-5 w-24 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
        ref={menuRef}
      >
        <ul className="py-1" aria-labelledby="dropdownInformationButton">
          <li>
            <p className="block py-2 px-4 text-sm text-red-700 hover:bg-red-50">
              Delete
            </p>
          </li>
          <li>
            <p className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              Edit
            </p>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="relative flex flex-col items-start p-4 mt-3 w-full bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-gray-50">
        {question.author.id === currentUser && (
          <>
            <button
              className="absolute top-0 right-0 items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
              onClick={() => setMenu(!menu)}
            >
              <BiDotsVerticalRounded />
            </button>
            {menu && <Menu />}
          </>
        )}
        <div className="w-full">
          <div className="flex flex-rowjustify-start">
            <div className="w-6 h-6 relative mx-3 rounded-full">
              <Avatar user={question.author} />
            </div>
            {question.answered ? (
              <span className="flex items-center justify-center h-6 w-36 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full">
                Answered
              </span>
            ) : (
              <span className="flex items-center justify-center h-6 w-36 px-3 text-xs font-semibold bg-gray-100 rounded-full">
                Not Answered
              </span>
            )}
          </div>

          <h4 className="mt-3 text-sm font-medium">{question.content}</h4>
          <div className="flex flex-row items-center w-full mt-3 text-xs font-medium text-gray-400">
            <div className="flex items-center ">
              <BsFillCalendar2Fill />
              <span className="ml-1 leading-none">
                {new Date(question.date).toLocaleDateString()}
              </span>
            </div>
            <div
              className="relative flex items-center ml-4 hover:text-gray-900"
              onClick={() => setShowResponses(!showResponses)}
            >
              <BiCommentDetail />
              <span className="ml-1 leading-none">
                {question.VideoAnswers.length}
              </span>
            </div>
            {question.timestamp && (
              <div
                className="flex items-center ml-4 hover:text-gray-900"
                onClick={handleScrollTimestamp}
              >
                <IoMdTime />
                <span className="ml-1 leading-none">
                  {secondsFormater(question.timestamp)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {question.answered && !showResponses && (
        <div className="flex flex-row w-full mt-1">
          <div className="border border-gray-400 h-full mx-6 mt-1"></div>
          <Response
            response={responses[0]}
            playerRef={playerRef}
            parentAuthorId={question.author.id}
            currentUser={currentUser}
            setResponses={setResponses}
            key={responses[0].id}
          />
        </div>
      )}
      {showResponses && (
        <div className="flex flex-row w-full mt-1">
          <div className="border border-gray-400 h-full mx-6 mt-1"></div>
          <div className="flex flex-col w-full">
            {renderResponses}
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowReplay(!showReplay)}
            >
              Post a replay
              {showReplay ? (
                <IoIosArrowDown className="ml-2" size={24} />
              ) : (
                <IoIosArrowUp className="ml-2" size={24} />
              )}
            </button>
            {showReplay && (
              <div className="flex flex-col w-full">
                <p className="p-1 font-medium">Write a response</p>
                <div className="flex flex-row items-center w-full">
                  <div className="flex flex-row items-center w-full">
                    <button
                      className="flex flex-row items-center justify-center text-sm my-1 mb-2 border-b hover:border-b-gray-800 hover:text-gray-900"
                      onClick={handleAddTimestamp}
                    >
                      <IoMdTime />
                      Timestamp
                    </button>
                    {timestamp && (
                      <>
                        <p className="mx-1">-</p>
                        <div
                          className="text-sm cursor-pointer tooltip"
                          data-tip="click to reset"
                          onClick={() => setTimestamp(null)}
                        >
                          {secondsFormater(timestamp)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  className="textarea w-full border-gray-800"
                  rows={2}
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement>
                  ): void => {
                    setContent(e.target.value);
                  }}
                />
                {error && (
                  <div className="flex w-full items-center justify-center my-2">
                    <div className="flex w-full justify-center items-center sm:w-4/5 bg-red-500 h-7 text-white rounded error font-thin text-lg">
                      <BiError />
                      {error}
                    </div>
                  </div>
                )}
                <div
                  className="btn btn-xs btn-outline mt-2 w-44"
                  onClick={handleSendResponse}
                >
                  Post a response
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Response = ({
  response,
  playerRef,
  currentUser,
  parentAuthorId,
  setResponses,
}: {
  response: VideoQuestion;
  playerRef: MutableRefObject<ReactPlayer | undefined>;
  currentUser: string;
  parentAuthorId: String;
  setResponses: Dispatch<SetStateAction<VideoQuestion[]>>;
}) => {
  const handleScrollTimestamp = () => {
    if (!response.timestamp) return;

    document.getElementById("player")?.scrollIntoView({ behavior: "smooth" });
    playerRef.current?.seekTo(response.timestamp);
  };

  const handleMarkAsAnswer = async () => {
    try {
      const res = await axios.post(
        `${baseurl}/video/answer`,
        {
          parentQuestionId: response.parentQuestionId,
          responseId: response.id,
        },
        { withCredentials: true }
      );

      console.log(res.data);

      if (res.status === 200) {
        setResponses((responses) => {
          responses[0] = { ...responses[0], is_answer: false };
          return responses
            .map((response) =>
              response.id === res.data.promotedId
                ? { ...response, is_answer: true }
                : response
            )
            .sort((value) => (value.is_answer ? -1 : 1));
        });
      }
    } catch (error) {}
  };
  return (
    <div className="relative flex flex-col items-start p-4 mt-3 w-full bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-gray-50">
      {response.author.id === currentUser && (
        <button className="absolute top-0 right-0 items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex">
          <BiDotsVerticalRounded />
        </button>
      )}
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center text-xs font-medium text-gray-400">
            <div className="w-6 h-6 relative mx-1 sm:mx-2 rounded-full">
              <Avatar user={response.author} />
            </div>

            <div className="flex items-center">
              <BsFillCalendar2Fill />
              <span className="ml-1 leading-none">
                {new Date(response.date).toLocaleDateString()}
              </span>
            </div>
            {response.timestamp && (
              <div
                className="flex items-center mx-2 hover:text-gray-900"
                onClick={handleScrollTimestamp}
              >
                <IoMdTime />
                <span className="ml-1 leading-none">
                  {secondsFormater(response.timestamp)}
                </span>
              </div>
            )}
            {parentAuthorId === currentUser && (
              <button
                className="flex mx-2 border-b-2 hover:text-gray-800 hover:border-gray-800"
                onClick={handleMarkAsAnswer}
              >
                Mark as answer
              </button>
            )}
          </div>
          {response.is_answer && (
            <span className="flex items-center justify-center h-6 w-36 px-3 text-xs mr-4 font-semibold text-green-500 bg-green-100 rounded-full">
              Answer
            </span>
          )}
        </div>
        <h4 className="mt-3 text-sm font-medium">{response.content}</h4>
      </div>
    </div>
  );
};
