import React from "react";
import NoSsr from "./NoSsr";

export default function FormatDate({ date }: { date: Date | undefined }) {
  if (!date) return <NoSsr>Parsing...</NoSsr>;
  return (
    <NoSsr>
      {new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </NoSsr>
  );
}
