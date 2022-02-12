import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { Dispatch, SetStateAction, useState } from "react";
import useHasImage from "../../../Hooks/useHasImage";
import {
  CourseInterface,
  CourseScheduleType,
  ScheduleDate,
} from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import ReactDateTime from "react-datetime-picker/dist/entry.nostyle";
import ImageSelector from "../../../components/Inputs/ImageSelector";
import useRequest from "../../../lib/useRequest";
import NoSsr from "../../../components/NoSsr";

export default function GeneralSettings({
  course,
}: {
  course: CourseInterface;
}) {
  const [description, setDescription] = useState(course.details.description);
  const [name, setName] = useState(course.name);
  const [publicName, setPublicName] = useState(course.public_name);
  const [image, setImage] = useState<File | undefined>();

  const [schedule, setSchedule] = useState<CourseScheduleType>(
    course.scheduleType
  );

  const [interval, setInterval] = useState(course.interval);
  const [scheduledDates, setScheduledDates] = useState(course.scheduledDates);

  const { url } = useHasImage(`${course.name}`, { type: "course_logo" });

  const router = useRouter();

  const { executeQuery } = useRequest();

  const saveChanges = async () => {
    const changesForm = new FormData();

    changesForm.append("name", name);
    changesForm.append("public_name", publicName);
    changesForm.append("description", description);
    changesForm.append("courseName", course.name);
    changesForm.append("old_name", course.name);
    changesForm.append("scheduleType", schedule);
    changesForm.append("interval", JSON.stringify(interval));
    changesForm.append("scheduledDates", JSON.stringify(scheduledDates));

    if (image) changesForm.append("image", image);

    executeQuery(
      async () => {
        const changesRes = await axios.post(
          `${baseurl}/course/savechanges`,
          changesForm,
          { withCredentials: true }
        );

        return changesRes;
      },
      {
        loadingTitle: "Saving Changes...",
        successTitle: `Changes: ${course.public_name}`,
        successBody: "Changes have been saved",
        successStatus: 201,
        onSuccess: () => router.push(name),
      }
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-2xl font-bold">{publicName} - Editor</p>
      <div className="flex flex-col w-3/4 font-semibold">
        <div className="flex flex-row w-full">
          <div className="form-control w-full mx-3">
            <label className="label">
              <span className="label-text">Course Public Name</span>
            </label>
            <input
              type="text"
              value={publicName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPublicName(e.target.value)
              }
              className="input input-bordered"
            />
          </div>
          <div className="form-control w-full mx-3">
            <label className="label">
              <span className="label-text">Course Name</span>
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
        </div>

        <div className="flex flex-row w-full mt-3">
          <div className="form-control w-1/2 mb-3 mx-3">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea h-36 textarea-bordered"
              placeholder="Bio"
              defaultValue={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <label className="label">
              <span className="label-text">Course Image</span>
            </label>
            <div className="relative w-32 h-32 rounded-xl border cursor-pointer overflow-hidden">
              <ImageSelector
                image={image}
                setImage={setImage}
                previewN={url}
                shape="square"
              />
            </div>
          </div>
        </div>
        <CourseSchedule
          schedule={schedule}
          setSchedule={setSchedule}
          interval={interval}
          setInterval={setInterval}
          scheduledDates={scheduledDates}
          setScheduledDates={setScheduledDates}
        />
      </div>
      <a className="btn max-w-2xl w-full mt-3" onClick={() => saveChanges()}>
        Save Chanes
      </a>
    </div>
  );
}

const CourseSchedule = ({
  schedule,
  setSchedule,
  interval,
  setInterval,
  scheduledDates,
  setScheduledDates,
}: {
  schedule: CourseScheduleType;
  setSchedule: Dispatch<SetStateAction<CourseScheduleType>>;
  interval: number | undefined;
  setInterval: Dispatch<SetStateAction<number | undefined>>;
  scheduledDates: ScheduleDate[];
  setScheduledDates: Dispatch<SetStateAction<ScheduleDate[]>>;
}) => {
  const [freeScheduleDate, setFreeScheduleDate] = useState(new Date());

  const tableDates = scheduledDates?.map((date, index) => {
    return (
      <tr key={index}>
        <th>{index + 1}</th>
        <td>
          {new Date(date.startingAt).toLocaleDateString(undefined, {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </td>
        <td>{date.status}</td>
        <td>
          <button
            className="btn btn-sm"
            onClick={() =>
              setScheduledDates((dts) =>
                dts?.filter((dt) => dt.startingAt !== date.startingAt)
              )
            }
          >
            Remove
          </button>
        </td>
      </tr>
    );
  });

  const handleAddaDate = () => {
    const date: ScheduleDate = {
      startingAt: freeScheduleDate,
      status: "upcoming",
    };

    setScheduledDates(scheduledDates ? [...scheduledDates, date] : [date]);
  };

  return (
    <>
      <div className="divider w-full">Schedule</div>
      <div className="flex flex-col w-full items-center justify-center">
        <select
          className="select select-bordered w-full max-w-md"
          onChange={(e) => setSchedule(e.target.value as any)}
          placeholder="Course schedule"
          value={schedule}
        >
          <option value="START_ON_JOIN">Start on Join</option>
          <option value="INTERVAL">Interval</option>
          <option value="SCHEDULE">Schedule it yourself</option>
        </select>
        <div className="flex p-4 mt-2 w-full justify-center text-sm font-normal">
          {schedule === "START_ON_JOIN" && (
            <p>Users will be able to start the course on join</p>
          )}
          {schedule === "INTERVAL" && (
            <div className="flex flex-col w-full max-w-xs">
              <label className="label">Interval value</label>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                placeholder="type value in days"
              />
            </div>
          )}
          {schedule === "SCHEDULE" && (
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full max-w-sm">
                <ReactDateTime
                  onChange={setFreeScheduleDate}
                  value={freeScheduleDate}
                />
                <button
                  className="btn btn-outline mt-2"
                  onClick={handleAddaDate}
                >
                  Add a date
                </button>
              </div>

              <div className="overflow-x-auto w-full mx-5">
                <NoSsr>
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Starting date</th>
                        <th>Status</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>{tableDates}</tbody>
                  </table>
                </NoSsr>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
