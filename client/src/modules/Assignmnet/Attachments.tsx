import Link from "next/link";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import useSWR from "swr";
import { baseurl } from "../../lib/fetcher";

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

export const DocumentAttachment = ({
  id,
  css,
  remove,
}: {
  id: string;
  css?: string;
  remove?: () => void;
}) => {
  const [name, setName] = useState("");
  useSWR(`${baseurl}/assignment/file/name/doc/${id}`, {
    onSuccess: (data) => setName(data.name),
  });

  return (
    <div
      className={`flex flex-row my-1 mx-1 h-16 justify-between items-center rounded border border-gray-900 w-64 min-w-[16rem] ${css}`}
      key={id}
    >
      <Link href={`/doc/${id}`}>
        <a
          className="flex w-14 h-14 rounded border border-gray-400 m-1"
          target="_blank"
        ></a>
      </Link>{" "}
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

export const VideoAttachment = ({
  id,
  css,
  remove,
}: {
  id: string;
  css?: string;
  remove?: () => void;
}) => {
  const [name, setName] = useState("");
  useSWR(`${baseurl}/assignment/file/name/video/${id}`, {
    onSuccess: (data) => setName(data.name),
  });

  return (
    <div
      className={`flex flex-row my-1 mx-1 h-16 justify-between items-center rounded border border-gray-900 w-64 min-w-[16rem] ${css}`}
      key={id}
    >
      <Link href={`/doc/${id}`}>
        <a
          className="flex w-14 h-14 rounded border border-gray-400 m-1"
          target="_blank"
        ></a>
      </Link>
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

export const LinkAttachment = ({
  link,
  css,
  remove,
}: {
  link: string;
  css?: string;
  remove?: () => void;
}) => {
  return (
    <div
      className={`flex flex-row my-1 h-16 justify-between items-center rounded border border-gray-900 w-64 min-w-[16rem] ${css}`}
    >
      <Link href={link}>
        <a
          className="flex w-14 h-14 rounded border border-gray-400 m-1"
          target="_blank"
        ></a>
      </Link>
      <p
        className={`font-mono text-left truncate ${
          remove ? "max-w-[8rem]" : "w-[11rem]"
        }`}
      >
        {link}
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
