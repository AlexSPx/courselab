import React from "react";

export default function Error401() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <p className="font-semibold text-2xl uppercase">
        <p className="text-center text-8xl">401</p>
        {`Either the document does not exist or`}
        <br />
        {` you don't have
              permissions to access it`}
      </p>
    </div>
  );
}
