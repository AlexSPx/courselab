import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import useHasImage from "../Hooks/useHasImage";
import { GeneralUserInformation } from "../interfaces";

export default function Avatar(
  { user, refresh }: { user?: GeneralUserInformation; refresh?: boolean } = {
    refresh: true,
  }
) {
  const { userData } = useContext(UserContext);

  const userInfo = {
    username: user ? user.username : userData?.user?.username,
    first_name: user ? user.first_name : userData?.user?.first_name,
    last_name: user ? user.last_name : userData?.user?.last_name,
  };

  const { url } = useHasImage(`${userInfo.username}`, {
    avatar: `${userInfo.first_name}-${userInfo.last_name}`,
    type: "avatar",
    refresh,
  });

  return (
    <Image
      src={url}
      alt="Avatar"
      layout="fill"
      className="rounded-full"
      objectFit="cover"
    />
  );
}
