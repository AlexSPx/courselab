import { Dispatch, SetStateAction, useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { LeftArrow, RightArrow } from "../svg/small";

export default function DatePickerEx({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) {
  const nextDay = () =>
    setDate(
      (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1)
    );

  const previousDay = () =>
    setDate(
      (dt) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1)
    );

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex cursor-pointer select-none" onClick={previousDay}>
        <LeftArrow />
      </div>
      <DatePicker value={date} onChange={setDate} />
      <div className="flex cursor-pointer select-none" onClick={nextDay}>
        <RightArrow />
      </div>
    </div>
  );
}
