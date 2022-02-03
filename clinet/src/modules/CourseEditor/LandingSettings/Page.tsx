import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { CourseDetails, Sponsor } from "../../../interfaces";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Quill from "quill";
import { useModals } from "../../../components/Modal";
import SponsorCreate from "../../../components/Modal/Menus/SponsorCreate";
import { GrFormClose } from "react-icons/gr";
import TweetEmbed from "react-tweet-embed";
import AddATweet from "../../../components/Modal/Menus/AddATweet";
import axios from "axios";
import { baseurl } from "../../../lib/fetcher";
import dynamic from "next/dynamic";
import useRequest from "../../../lib/useRequest";

const TextDetails = dynamic(() => import("./TextDetails"), { ssr: false });

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "rgb(209 213 219)",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const removedStyles: CSSProperties = {
  borderStyle: "dashed",
  borderColor: "#ff1744",
  borderWidth: 2,
  borderRadius: 1,
};

export default function Landing({ details }: { details: CourseDetails }) {
  const [files, setFiles] = useState<File[]>();
  const [quill, setQuill] = useState<Quill>();
  const [sponsors, setSponsors] = useState<Sponsor[]>(details.sponsors);
  const [tweets, setTweets] = useState<string[]>(details.reviews);

  const { pushModal, closeModal } = useModals();

  useEffect(() => {
    if (!quill) return;
    quill.setContents(JSON.parse(details.description));
  }, [details.description, quill]);

  return (
    <div
      className="flex flex-col h-full w-full items-center relative overflow-auto"
      id="journal-scroll"
    >
      <div className="flex flex-row w-full items-center justify-center">
        <p className="flex font-bold text-2xl text-center">
          {details.course.public_name} - Landing page
        </p>
      </div>
      <div className="divider w-[95%]">Display Images</div>
      <ImagesSection
        files={files}
        setFiles={setFiles}
        courseName={details.courseName}
        initial={details.images}
      />
      <div className="divider w-[95%]">Course Description</div>
      <TextDetails
        quill={quill}
        setQuill={setQuill}
        courseName={details.courseName}
      />
      <div className="divider w-[95%]">Sponsors</div>
      <SponsorSection
        sponsors={sponsors}
        setSponsors={setSponsors}
        pushModal={pushModal}
        closeModal={closeModal}
        courseName={details.courseName}
      />
      <div className="divider w-[95%]">Reviews</div>
      <ReviewsSection
        tweets={tweets}
        setTweets={setTweets}
        pushModal={pushModal}
        closeModal={closeModal}
        courseName={details.courseName}
      />
    </div>
  );
}

const ImagesSection = ({
  files,
  setFiles,
  initial,
  courseName,
}: {
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  initial: string[];
  courseName: string;
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [removed, setRemoved] = useState<string[]>();
  const [initialFiles, setInitialFiles] = useState(initial);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        setFiles((files) => {
          const newF = acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          );
          if (files) return [...files, ...newF];
          else return [...newF];
        });
      },
    });

  const renderPreviewImages = files?.map((file) => {
    const removeImage = () => {
      setFiles((files) => {
        return files?.filter((f) => f.preview !== file.preview);
      });
    };
    return (
      <div
        className="flex relative h-full w-24 min-w-[24rem] mx-1"
        key={file.preview}
      >
        <Image
          src={file.preview!}
          layout="fill"
          objectFit="contain"
          alt=""
          onClick={removeImage}
        />
      </div>
    );
  });

  const initialImages = initialFiles.map((file) => {
    const removeImage = () => {
      setRemoved((rmed) => {
        if (!rmed) return [file];
        if (rmed.includes(file)) return rmed.filter((rm) => rm !== file);
        return [...rmed, file];
      });
    };

    return (
      <div
        className="flex relative h-full w-24 min-w-[24rem] mx-1"
        key={file}
        style={removed?.includes(file) ? removedStyles : undefined}
      >
        <Image
          src={`${baseurl}/course/images/${file}`}
          layout="fill"
          objectFit="contain"
          alt=""
          onClick={removeImage}
        />
      </div>
    );
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleSaveImages = async () => {
    const data = new FormData();

    files?.forEach((file) => data.append("images", file));

    removed?.forEach((file) => data.append("removed", file));

    const res = await axios.post(
      `${baseurl}/course/details/images/${courseName}`,
      data,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      setFiles(undefined);
      setInitialFiles(res.data);
    }
  };

  useEffect(() => {
    if (files?.length || removed?.length) setHasChanges(true);
    else setHasChanges(false);
  }, [files, removed]);

  return (
    <div className="flex flex-row w-[95%] h-[32rem] mt-6">
      <div
        className="flex flex-row w-3/4 border border-gray-300 mx-2 rounded overflow-auto"
        id="journal-scroll"
      >
        {files || initialImages ? (
          <>
            {renderPreviewImages}
            {initialImages}
          </>
        ) : (
          <div className="flex w-full h-full items-center justify-center text-gray-500">
            Image section
          </div>
        )}
      </div>
      <div className="flex flex-col h-[32rem]">
        <div
          {...getRootProps({ style: style as any })}
          className="w-full flex items-center justify-center text-center h-[32rem]"
        >
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files</p>
        </div>
        {hasChanges && (
          <button className="btn btn-outline mt-2" onClick={handleSaveImages}>
            Update Images
          </button>
        )}
      </div>
    </div>
  );
};

const SponsorSection = ({
  sponsors,
  setSponsors,
  pushModal,
  closeModal,
  courseName,
}: {
  sponsors: Sponsor[] | undefined;
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  pushModal: any;
  closeModal: any;
  courseName: string;
}) => {
  const openCreateMenu = () => {
    const mkey = Date.now();
    pushModal(
      <SponsorCreate
        key={mkey}
        onClose={() => closeModal(mkey)}
        setSponsors={setSponsors}
        courseName={courseName}
      />,
      { timer: false }
    );
  };

  const mapSponsors = sponsors?.map((sponsor) => {
    const handleRemove = async () => {
      const res = await axios.post(
        `${baseurl}/course/details/sponsor/${courseName}/${sponsor.name}`,
        { action: "DELETE" },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setSponsors((sponsors) =>
          sponsors?.filter((sp) => sp.name !== sponsor.name)
        );
      }
    };

    return (
      <div
        className="flex flex-col relative items-center mx-5 group"
        key={sponsor.name}
        onClick={handleRemove}
      >
        <GrFormClose className="absolute hidden bg-gray-400 h-4 w-4 z-10 right-1 top-1 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex" />
        <Image
          src={`${baseurl}/course/images/${sponsor.path}`}
          className="rounded-md"
          width={112}
          height={112}
          objectFit="cover"
          alt={sponsor.name}
        />
        <p className="text-gray-600 text-lg font-semibold">{sponsor.name}</p>
      </div>
    );
  });

  return (
    <div className="flex flex-col w-[95%] mt-2 mb-4 relative items-center justify-center">
      <div className="flex flex-row">{mapSponsors}</div>
      <button className="btn btn-outline mt-2" onClick={openCreateMenu}>
        Add a sponsor
      </button>
    </div>
  );
};

const ReviewsSection = ({
  tweets,
  setTweets,
  pushModal,
  closeModal,
  courseName,
}: {
  tweets: string[] | undefined;
  setTweets: React.Dispatch<React.SetStateAction<string[]>>;
  pushModal: any;
  closeModal: any;
  courseName: string;
}) => {
  const openAddTweetMenu = () => {
    const mkey = Date.now();
    pushModal(
      <AddATweet
        key={mkey}
        onClose={() => closeModal(mkey)}
        setTweets={setTweets}
      />,
      { timer: false }
    );
  };

  const { executeQuery } = useRequest();

  const renderTweets = tweets?.map((tweet) => {
    return <TweetEmbed id={tweet} key={tweet} className="mx-2" />;
  });

  const handleSaveTweets = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/details/reviews/${courseName}`,
          { reviews: tweets },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingBody: "Updating reviews",
        successBody: "Tweets have been updated",
      }
    );
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex flex-wrap w-full justify-center">{renderTweets}</div>
      <div className="flex flex-row">
        <button
          className="btn btn-outline mt-2 mb-6 mx-1"
          onClick={openAddTweetMenu}
        >
          Add a Tweet
        </button>
        <button
          className="btn btn-outline mt-2 mb-6 mx-1"
          onClick={handleSaveTweets}
        >
          Save Tweets
        </button>
      </div>
    </div>
  );
};
