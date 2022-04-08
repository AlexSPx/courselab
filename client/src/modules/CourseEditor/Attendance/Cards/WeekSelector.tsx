import { Dispatch, SetStateAction } from "react";

export default function WeekSelector({
  currentWeek,
  setCurrentWeek,
  courseWeeks,
  weekLabel,
  selectDateLabel,
}: {
  currentWeek: number;
  setCurrentWeek: Dispatch<SetStateAction<number>>;
  courseWeeks: number;
  weekLabel: string;
  selectDateLabel: string;
}) {
  const mapWeekOptions = [...Array(courseWeeks)].map((_, index) => {
    return (
      <option value={`${index}`} key={index}>
        {weekLabel} {index + 1}
      </option>
    );
  });

  return (
    <select
      onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
      className="select select-bordered w-full max-w-md mt-10"
      value={currentWeek}
    >
      <option value="def" defaultChecked={true}>
        {selectDateLabel}
      </option>
      {mapWeekOptions}
    </select>
  );
}
