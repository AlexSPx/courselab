import { GrClose } from "react-icons/gr";

export const File = ({
  name,
  id,
  css,
  remove,
}: {
  name: string;
  id: string;
  css?: string;
  remove?: () => void;
}) => {
  return (
    <div
      className={`flex flex-row my-1 h-16 justify-between items-center rounded border border-gray-900 w-64 min-w-[16rem] ${css}`}
      key={id}
    >
      <div
        className="flex tooltip w-14 h-14 rounded border border-gray-400 m-1"
        data-tip="click for a preview"
      ></div>
      <p
        className={`font-mono text-left truncate ${
          remove ? "max-w-[8rem]" : "w-[11rem]"
        }`}
      >
        {name}
      </p>
      {remove && (
        <GrClose
          className="m-4 hover:bg-gray-100 rounded p-1 cursor-pointer"
          size={27}
          onClick={remove}
        />
      )}
    </div>
  );
};
