import { Dispatch, SetStateAction } from "react";

export const Field = ({
  placeholder,
  type = "text",
  data,
  setData,
}: {
  placeholder: string;
  type?: "text" | "password";
  data: string | string[] | undefined;
  setData: Dispatch<SetStateAction<string | undefined>> | Function;
}) => {
  return (
    <div className="flex flex-col mb-2">
      <div className="relative">
        <input
          value={data}
          type={type}
          className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setData(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
