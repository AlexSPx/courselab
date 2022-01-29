import React, { Dispatch, SetStateAction } from "react";

export default function TextArea({
  placeholder,
  data,
  setData,
}: {
  placeholder: string;
  data?: string | string[] | undefined;
  setData: Dispatch<SetStateAction<string | undefined>> | Function;
}) {
  return (
    <label className="text-gray-700">
      <textarea
        className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        id="journal-scroll"
        placeholder={placeholder}
        value={data}
        name={placeholder}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
          setData(e.target.value)
        }
      ></textarea>
    </label>
  );
}
