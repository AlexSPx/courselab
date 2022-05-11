import axios from "axios";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import Modal from "..";
import { UserContext } from "../../../contexts/UserContext";
import { baseurl } from "../../../lib/fetcher";
import useRequest from "../../../lib/useRequest";
import { CoursePublicRaw } from "../../../modules/CourseExplorer/Course";
import { CloseIcon } from "../../../svg/small";
import useHasImage from "../../../Hooks/useHasImage";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import FormatDate from "../../FormatDate";
import { TFunction } from "react-i18next";
import { useRouter } from "next/router";

export default function EnrollMenu({
  course,
  onClose,
  t,
}: {
  course: CoursePublicRaw;
  onClose: Function;
  t: TFunction;
}) {
  const [startingDate, setStartingDate] = useState(new Date());
  const [dateChoseValue, setdateChoseValue] = useState("def");

  const wrapperRef = useRef(null);

  const { userData } = useContext(UserContext);
  const { push } = useRouter();

  const { executeQuery } = useRequest();
  const { url } = useHasImage(course.name, {
    type: "course_logo",
    width: 300,
    height: 300,
  });
  useOnOutsideClick(wrapperRef, () => onClose());

  const handleEndroll = async () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/course/enroll`,
          {
            course: course.name,
            userId: userData?.user?.id,
            startingAt: startingDate,
          },
          { withCredentials: true }
        );
        return res;
      },
      {
        loadingTitle: "Setting up...",
        loadingBody: "This might take awhile",
        successTitle: "Everything is set",
        successBody: "Redirecting...",
        onFail: (error) => {
          if (error.response?.data === "Must be logged in") push("/login");
          onClose();
        },
      }
    );
  };

  const DateSelector = () => {
    const mapDates = course?.scheduledDates.map((date, index) => {
      const sdate = new Date(date.startingAt);
      if (sdate < new Date()) return;
      return (
        <option value={`${date.startingAt}`} key={index}>
          <FormatDate date={sdate} />
        </option>
      );
    });

    return (
      <select
        onChange={(e) => {
          setStartingDate(new Date(e.target.value));
          setdateChoseValue(new Date(e.target.value).toString());
        }}
        className="select select-bordered w-full max-w-md mt-3"
        value={dateChoseValue}
      >
        <option value="def" disabled={true}>
          {t("select-date")}
        </option>
        {mapDates}
      </select>
    );
  };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white max-h-[60%]">
            <span className="font-semibold label">{t("enroll")}</span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
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
                  alt={course?.public_name}
                />
              </div>
              <p className="text-xl font-semibold mt-4">
                {course?.public_name}
              </p>
              {userData?.isAuth && (
                <p className="text-sm text-gray-500">
                  {t("signed-as", { username: userData?.user?.username })}
                </p>
              )}
              {course?.scheduleType === "SCHEDULE" && <DateSelector />}
              <button
                className="btn btn-info px-20 mt-3 font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleEndroll}
                aria-label="Enroll into a course"
              >
                {t("enroll")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
