import React, { useRef, useState } from "react";
import TweetEmbed from "react-tweet-embed";
import Modal from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { CloseIcon } from "../../../svg/small";

export default function AddATweet({
  onClose,
  setTweets,
}: {
  onClose: Function;
  setTweets: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const wrapperRef = useRef(null);

  const [tweetInput, setTweetInput] =
    useState<{ url: string; id: string | undefined }>();
  const [error, setError] = useState<string>();

  useOnOutsideClick(wrapperRef, () => onClose());

  const handleAddATweet = () => {
    if (!tweetInput || !tweetInput.id) {
      setError("Name must be provided");
      return;
    }

    setTweets((tweets) => {
      if (!tweets) return [tweetInput.id!];
      else return [...tweets, tweetInput.id!];
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
          <div className="flex flex-row justify-between p-3 border-b bg-white max-h-[60%]">
            <span className="font-semibold label">Add a sponsor</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col px-6 py-5 bg-gray-50">
            <div className="flex w-full justify-center items-center">
              <TweetEmbed
                className="w-96"
                id={`${tweetInput?.id}`}
                placeholder={"loading"}
              />
            </div>
            <label className="label">
              <span className="label-text">Tweet url</span>
            </label>
            <input
              type="text"
              placeholder={`https://twitter.com/......./status/........`}
              value={tweetInput?.url}
              className="input input-bordered border border-gray-200 rounded shadow-sm"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setTweetInput({
                  url: e.target.value,
                  id: e.target.value.split("/").at(-1)?.toString(),
                });
              }}
            />

            {error && (
              <div className="flex w-full my-1 items-center justify-center text-red-600 font-semibold">
                Error: {error}
              </div>
            )}
            <button className="btn btn-outline my-2" onClick={handleAddATweet}>
              Create
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// const TweetSkeleton = () => {
//   return (
//     <div className="flex flex-col w-96 p-3 rounded-lg border">
//       <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>
//       <div className="h-5 w-full my-1 mt-6 bg-gray-200 rounded-md animate-pulse"></div>
//       <div className="h-5 w-full my-1 bg-gray-200 rounded-md animate-pulse"></div>
//       <div className="h-5 w-3/4 my-1 bg-gray-200 rounded-md animate-pulse"></div>
//     </div>
//   );
// };
