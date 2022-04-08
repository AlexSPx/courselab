import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import { absurl, baseurl, fetcher } from "../lib/fetcher";
import { withSize } from "../lib/withSize";

const refreshIntervalMiliseconds = 10000;

export default function useHasImage(
  name: string,
  {
    avatar,
    type,
    width,
    height,
    refresh,
  }: {
    avatar?: string;
    type?: "avatar" | "course_logo";
    width?: string | number;
    height?: string | number;
    refresh?: boolean;
  } = {
    type: "avatar",
    refresh: true,
  }
) {
  const [url, setUrl] = useState<string>(`/`);

  if (type === "avatar") AvatarCheck(name, setUrl, avatar, refresh);
  if (type === "course_logo") CourseLogoCheck(name, setUrl, refresh);

  if (width && height && !url.includes("avatars.dicebear.com")) {
    return { url: withSize(url, { width, height }) };
  }
  return { url };
}

const AvatarCheck = (
  name: string,
  setUrl: Dispatch<SetStateAction<string>>,
  avatar?: string,
  refresh?: boolean
) => {
  const url = `/user/avatars/${name}`;

  const { error } = useSWR(`${baseurl}${url}.jpg`, {
    refreshInterval: refresh ? refreshIntervalMiliseconds : 0,
    revalidateOnFocus: refresh,
    revalidateOnReconnect: refresh,
    revalidateIfStale: refresh,
  });

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
  setUrl: Dispatch<SetStateAction<string>>,
  refresh?: boolean
) => {
  const url = `/course/logo/${name}`;

  const { error } = useSWR(`${baseurl}${url}.jpg`, {
    refreshInterval: refresh ? refreshIntervalMiliseconds : 0,
    revalidateOnFocus: refresh,
    revalidateOnReconnect: refresh,
    revalidateIfStale: refresh,
  });

  useEffect(() => {
    if (error) {
      setUrl(`${baseurl}/course/logo/default.jpg`);
      return;
    }

    setUrl(`${baseurl}${url}.jpg`);
  }, [error, setUrl, url]);
};
