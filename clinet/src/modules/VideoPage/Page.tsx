import axios from "axios";
import React, { useRef, useState } from "react";
import { KeyedMutator, useSWRConfig } from "swr";
import {
  ErrorModal,
  LoadingModal,
  SuccessModal,
  useModals,
} from "../../components/Modal";
import { VideoInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import VideoPlayer from "./VideoPlayer";
import { Left, Main, Right } from "../Layouts/MainLayout";
import ReactPlayer from "react-player";
import Questions from "./Questions";
import useRequest from "../../lib/useRequest";

export default function Page({
  video,
  mutate,
}: {
  video: VideoInterface;
  mutate: KeyedMutator<any>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>(video?.name);

  const { executeQuery } = useRequest();
  const playerRef = useRef<ReactPlayer | undefined>();

  const handleVideoUpload = async () => {
    if (!file) return;
    const newVideo = new FormData();
    newVideo.append("video", file);
    newVideo.append("videoId", video.id);
    newVideo.append("name", name);

    executeQuery(
      async () => {
        const res = await axios.post(`${baseurl}/video/upload`, newVideo, {
          withCredentials: true,
        });
        return res;
      },
      {
        loadingTitle: "Uploading",
        loadingBody: "Uploading video, please wait",
        successTitle: "Uploaded",
        successBody: "Successfully uploaded",
        onSuccess: () => mutate(),
      }
    );
  };

  return (
    <>
      {!video ? (
        <div className="flex">No Video</div>
      ) : (
        <>
          {!video.path ? (
            // Video Uploader
            <div className="flex flex-col w-full items-center">
              <label className="relative mt-3 w-2/5">
                <div className="input btn btn-outline w-full">
                  Select a Video
                </div>
                <input
                  className="hidden"
                  type="file"
                  name="video"
                  id="video"
                  accept="video/*"
                  onChange={(e: React.ChangeEvent<any>) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </label>
              {file && (
                <div className="flex flex-col w-2/5 mt-3">
                  <label className="label w-full">
                    <span className="label-text font-semibold ">
                      Course Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    className="input input-bordered"
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      e.preventDefault();
                      setName(e.target.value);
                    }}
                  />

                  <div
                    className="btn btn-sm btn-outline mt-2"
                    onClick={handleVideoUpload}
                  >
                    Upload Video
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Left></Left>
              <Main>
                <VideoPlayer video={video} playerRef={playerRef} />
                <div className="w-full border-b my-4"></div>
                <Questions video={video} playerRef={playerRef} />
              </Main>
              <Right></Right>
            </>
          )}
        </>
      )}
    </>
  );
}
