import { Dispatch, SetStateAction } from "react";

export const Field = ({
  placeholder,
  label,
  type = "text",
  data,
  setData,
  css,
}: {
  placeholder: string;
  label?: string;
  type?: "text" | "password";
  data: string | string[] | undefined;
  setData: Dispatch<SetStateAction<string | undefined>> | Function;
  css?: string;
}) => {
  return (
    <div className={`form-control w-full ${css}`}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder || ""}
        value={data}
        className="input input-bordered"
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setData(e.target.value)
        }
      />
    </div>
  );
};
