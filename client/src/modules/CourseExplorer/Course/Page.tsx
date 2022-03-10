import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { CoursePublicRaw } from ".";
import {
  CourseDetails,
  CourseGeneralInterface,
  ScheduleDate,
} from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import { withSize } from "../../../lib/withSize";
import { formatRawData } from "../Page";
import dynamic from "next/dynamic";
import TweetEmbed from "react-tweet-embed";
import { BsStarFill } from "react-icons/bs";
import { GiGraduateCap } from "react-icons/gi";
import useEnroll from "../../../components/Modal/Menus/EnrollMenu";
import NoSsr from "../../../components/NoSsr";
import { useModals } from "../../../components/Modal";
import EnrollMenu from "../../../components/Modal/Menus/EnrollMenu";

const Description = dynamic(() => import("./Description"), { ssr: false });

type Course = CourseGeneralInterface & {
  ExtendedDetails: CourseDetails;
};

const nextDate = (scheduledDates: ScheduleDate[] | undefined) => {
  if (!scheduledDates) return;
  return scheduledDates.filter((date) =>
    new Date(date.startingAt).getTime() > new Date().getTime() ? date : null
  );
};

export default function Page({ courseRaw }: { courseRaw: CoursePublicRaw }) {
  const course = useMemo<Course>(
    () => formatRawData([courseRaw])[0] as Course,
    [courseRaw]
  );

  const [isEnrollEnabled, setIsEnrollEnabled] = useState(true);

  const { pushModal, closeModal } = useModals();

  const handleOpenEnroll = () => {
    const mkey = Date.now();
    pushModal(
      <EnrollMenu
        key={mkey}
        onClose={() => closeModal(mkey)}
        course={courseRaw}
      />,
      { timer: false }
    );
  };

  return (
    <div
      className="flex w-full h-full justify-center overflow-auto"
      id="journal-scroll"
    >
      <div className="max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-16 lg:items-start">
          <div className="lg:sticky lg:top-16">
            <Images images={course.ExtendedDetails.images} />
            <div className="md:col-span-2 md:pr-8">
              <h2 className="text-2xl font-bold text-gray-900 my-2 sm:text-3xl">
                {course.public_name}
              </h2>
            </div>

            <p className="mt-2 text-gray-500">{course.details.description}</p>

            <dl className="flex items-center mt-6">
              <div className="flex items-center">
                <span className="p-2 text-white bg-green-600 rounded-full">
                  <BsStarFill />
                </span>
                <span className="flex ml-3 space-x-1 space-x-reverse text-sm font-medium text-gray-600 ">
                  <dt>Reviews</dt>
                  <dd className="order-first">12,400</dd>
                </span>
              </div>
              <div className="flex items-center ml-3">
                <span className="p-2 text-white bg-green-600 rounded-full">
                  <GiGraduateCap />
                </span>
                <span className="flex ml-3 space-x-1 space-x-reverse text-sm font-medium text-gray-600 ">
                  <dt>Students</dt>
                  <dd className="order-first">1,520,404</dd>
                </span>
              </div>
            </dl>

            <div className="flex items-stretch md:justify-end lg:justify-start mt-2">
              <a className="inline-flex items-center justify-center w-12 rounded-lg cursor-pointer bg-rose-50 text-rose-600 group">
                <FiHeart size={24} className="group-hover:fill-current" />
              </a>

              <button
                className="btn btn-info px-20 ml-3 font-medium text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleOpenEnroll}
                disabled={!isEnrollEnabled}
                aria-label="enroll"
              >
                Enroll
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Description description={course.ExtendedDetails.description} />
            <Schedule course={course} setIsEnrollEnabled={setIsEnrollEnabled} />
          </div>
        </div>
        {course.ExtendedDetails.sponsors.length > 0 && (
          <div className="flex w-full py-4 mt-1 items-center justify-center">
            <div className="divider w-full">Sponsors</div>
          </div>
        )}
        {course.ExtendedDetails.reviews.length > 0 && (
          <Reviews reviews={course.ExtendedDetails.reviews} />
        )}
      </div>
    </div>
  );
}

const Images = ({ images }: { images: string[] }) => {
  const RenderImages = () => {
    if (images.length === 0) {
      return <></>;
    }
    if (images.length === 1) {
      return (
        <div className="relative h-64 col-span-3 lg:h-96 sm:row-span-2">
          <Image
            layout="fill"
            objectFit="cover"
            alt="image"
            className="inset-0 object-cover w-full h-full rounded-lg"
            src={withSize(`${baseurl}/course/images/${images[0]}`, {
              width: 1000,
              height: 1000,
            })}
            priority
          />
        </div>
      );
    }
    return (
      <>
        <div className="relative h-64 col-span-2 lg:h-96 sm:row-span-2">
          <Image
            layout="fill"
            objectFit="cover"
            alt="image"
            className="inset-0 object-cover w-full h-full rounded-lg"
            src={withSize(`${baseurl}/course/images/${images[0]}`, {
              width: 1000,
              height: 1000,
            })}
            priority
          />
        </div>
        {images.slice(1, 3).map((img) => {
          return (
            <div className="relative h-32 col-span-1 sm:h-auto" key={img}>
              <Image
                layout="fill"
                objectFit="cover"
                alt="image"
                className="inset-0 object-cover w-full h-full rounded-lg"
                src={withSize(`${baseurl}/course/images/${img}`, {
                  width: 500,
                  height: 500,
                })}
                priority
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-2">
      <RenderImages />
    </div>
  );
};

const Reviews = ({ reviews }: { reviews: String[] }) => {
  const renderReviews = reviews.map((review) => {
    return <TweetEmbed id={`${review}`} className="mx-3" key={`${review}`} />;
  });

  return (
    <div className="flex flex-col w-full py-4 mt-1 items-center justify-center">
      <div className="divider w-full">Reviews</div>
      <div className="flex flex-warp">{renderReviews}</div>
    </div>
  );
};

const Schedule = ({
  course,
  setIsEnrollEnabled,
}: {
  course: Course;
  setIsEnrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const upcommingDates = useMemo<ScheduleDate[]>(
    () => nextDate(course.scheduledDates) as unknown as ScheduleDate[],
    [course.scheduledDates]
  );

  const mapUpcommingDates = upcommingDates?.map((date) => {
    if (!date) return;
    return (
      <tr key={date.startingAt.toString()}>
        <td>
          {new Date(date?.startingAt).toLocaleDateString(undefined, {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </td>
      </tr>
    );
  });

  useEffect(() => {
    if (course.scheduleType === "SCHEDULE" && !upcommingDates.length)
      setIsEnrollEnabled(false);
  }, [course.scheduleType, setIsEnrollEnabled, upcommingDates]);

  return (
    <NoSsr>
      <div className="flex flex-col p-4 bg-white border border-gray-100 shadow-sm rounded-xl items-center">
        <p className="font-bold text-2xl w-full">Schedule</p>
        {course.scheduleType === "START_ON_JOIN" && (
          <div>You will start the course on join</div>
        )}
        {course.scheduleType === "INTERVAL" && <div></div>}
        {course.scheduleType === "SCHEDULE" && (
          <div className="overflow-x-auto w-full mt-1 mx-5 m-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {mapUpcommingDates ? (
                  mapUpcommingDates
                ) : (
                  <tr>
                    <td>There are no dates</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </NoSsr>
  );
};
