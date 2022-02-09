import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import Modal, { useModals } from "../components/Modal";
import { UserContext } from "../contexts/UserContext";
import { baseurl } from "../lib/fetcher";
import useRequest from "../lib/useRequest";
import { CoursePublicRaw } from "../modules/CourseExplorer/Course";
import { CloseIcon } from "../svg/small";
import useHasImage from "./useHasImage";
import useOnOutsideClick from "./useOnOutsideClick";

export default function useEnroll({
  courseName,
  course,
}: {
  courseName: string;
  course?: CoursePublicRaw;
}) {
  const [courseData, setCourseData] = useState(course && course);
  const [modalKey, setModalKey] = useState(Date.now());

  const wrapperRef = useRef(null);

  const { userData } = useContext(UserContext);
  const { executeQuery } = useRequest();
  const { url } = useHasImage(courseName, {
    type: "course_logo",
    width: 300,
    height: 300,
  });
  const { pushModal, closeModal } = useModals();
  //   useOnOutsideClick(wrapperRef, () => closeModal(modalKey));

  useEffect(() => {
    if (course) return;
    const fetch = async () => {
      const res = await axios.get(`${baseurl}/course/${courseName}`);

      setCourseData(res.data);
    };
    fetch();
  }, [course, courseName]);

  const enroll = () => {
    if (!courseData) return;
    pushModal(<Menu key={modalKey} />, { timer: false });
  };

  const handleEndroll = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/enroll`,
          { course: courseName, userId: userData?.user?.id },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Setting up...",
        loadingBody: "This might take awhile",
        successTitle: "Everything is set",
        successBody: "Redirecting...",
      }
    );
  };

  const Menu = () => {
    if (!courseData) return null;
    return (
      <Modal>
        <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
          <div
            className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
            ref={wrapperRef}
          >
            <div className="flex flex-row justify-between p-3 border-b bg-white max-h-[60%]">
              <span className="font-semibold label">Enroll</span>
              <div
                className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
                onClick={() => closeModal(modalKey)}
              >
                <CloseIcon />
              </div>
            </div>
            <div className="flex flex-col px-6 py-5 bg-gray-50">
              <div className="flex flex-col w-full items-center justify-center">
                <div className="relative w-32 h-32 rounded-lg shadow-lg">
                  <Image
                    src={url}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-lg"
                    alt={courseData.public_name}
                  />
                </div>
                <p className="text-xl font-semibold mt-4">
                  {course?.public_name}
                </p>
                <p className="text-sm text-gray-500">
                  Signed in as @{userData?.user?.username}
                </p>
                <button
                  className="btn btn-info px-20 mt-3 font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleEndroll}
                >
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  return { enroll };
}
