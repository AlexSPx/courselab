import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import { absurl, baseurl, fetcher } from "../lib/fetcher";
import { withSize } from "../lib/withSize";

export default function useHasImage(
  name: string,

  {
    avatar,
    type,
    width,
    height,
  }: {
    avatar?: string;
    type?: "avatar" | "course_logo";
    width?: string | number;
    height?: string | number;
  } = {
    type: "avatar",
  }
) {
  const [url, setUrl] = useState<string>(`/`);

  if (type === "avatar") AvatarCheck(name, setUrl, avatar);
  if (type === "course_logo") CourseLogoCheck(name, setUrl);

  if (width && height) {
    return { url };
    // return { url: withSize(url, { width, height }) };
  }
  return { url };
}

const AvatarCheck = (
  name: string,
  setUrl: Dispatch<SetStateAction<string>>,
  avatar?: string
) => {
  const url = `/user/avatars/${name}`;

  const { error } = useSWR(`${baseurl}${url}.jpg`);

  useEffect(() => {
    if (error) {
      setUrl(`https://avatars.dicebear.com/api/initials/${avatar}.svg`);
      return;
    }

    setUrl(`${baseurl}${url}.jpg`);
  }, [error, setUrl, url, avatar]);
};

const CourseLogoCheck = (
  name: string,
  setUrl: Dispatch<SetStateAction<string>>
) => {
  const url = `/course/logo/${name}`;

  const { error } = useSWR(`${baseurl}${url}.jpg`);

  useEffect(() => {
    if (error) {
      setUrl(`${baseurl}/course/logo/default.jpg`);
      return;
    }

    setUrl(`${baseurl}${url}.jpg`);
  }, [error, setUrl, url]);
};
