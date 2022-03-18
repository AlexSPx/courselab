import { useContext, useRef, useState } from "react";
import Link from "next/link";
import Avatar from "../../components/Avatar";
import { UserContext } from "../../contexts/UserContext";
import { UserDataInterface } from "../../interfaces";
import axios from "axios";
import { baseurl } from "../../lib/fetcher";
import { ErrorModal, useModals } from "../../components/Modal";
import { useRouter } from "next/router";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";

export default function AuthHeader() {
  const { userData } = useContext(UserContext);

  const [dropdown, setDropdown] = useState(false);

  return (
    <header className="w-full border-b">
      <div className="navbar mb-1 text-black rounded-box m-1">
        <div className="flex-1 hidden px-2 mx-2 lg:flex">
          <Link href="/home">
            <a className="text-lg font-bold">CourseLab</a>
          </Link>
        </div>
        <div className="items-stretch hidden lg:flex mx-2">
          {userData?.user?.isAdmin && (
            <Link href="/cpanel">
              <a className="btn btn-ghost btn-sm rounded-btn">Control Panel</a>
            </Link>
          )}
          <Link href="/home">
            <a className="btn btn-ghost btn-sm rounded-btn">Home</a>
          </Link>
          <Link href="/messages">
            <a className="btn btn-ghost btn-sm rounded-btn">Chats</a>
          </Link>
          <Link href="/myfiles">
            <a className="btn btn-ghost btn-sm rounded-btn">Files</a>
          </Link>
          <Link href="/courses">
            <a className="btn btn-ghost btn-sm rounded-btn">Explorer</a>
          </Link>
          <Link href="/manager">
            <a className="btn btn-ghost btn-sm rounded-btn">Manager</a>
          </Link>
        </div>
        {/* <div className="flex-1 lg:flex-none">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-ghost border border-gray-300"
            />
          </div>
        </div>

        <div className="flex-none">
          <button
            className="hidden sm:flex btn btn-square btn-ghost"
            aria-label="search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div className="flex-none">
          <button
            className="btn btn-square btn-ghost"
            aria-label="notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div> */}
        <div className="flex-none">
          <div className="inline-block justify-start relative avatar online">
            <div
              className="w-11 h-11 m-1 cursor-pointer"
              onClick={() => setDropdown(!dropdown)}
            >
              <Avatar />
            </div>
            {dropdown && (
              <Menu user={userData} close={() => setDropdown(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const Menu = ({
  user,
  close,
}: {
  user: UserDataInterface | null;
  close: Function;
}) => {
  const { pushModal } = useModals();
  const router = useRouter();

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, close);

  const handleLogout = async () => {
    try {
      await axios.get(`${baseurl}/user/logout`, { withCredentials: true });
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        pushModal(<ErrorModal title="Error" body={`${error}`} />);
      } else
        pushModal(<ErrorModal title="Error" body={`Something went wrong`} />);
    }
  };

  return (
    <div
      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
      ref={wrapperRef}
    >
      <div className="py-3 px-4 text-gray-900 dark:text-white">
        <span className="block text-sm">
          {user?.user?.first_name} {user?.user?.last_name}
        </span>
        <span className="block text-sm font-medium truncat">
          {user?.user?.email}
        </span>
      </div>
      <ul className="py-1" aria-labelledby="dropdownInformationButton">
        <li>
          <Link href={"/settings"}>
            <a className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              Settings
            </a>
          </Link>
        </li>
      </ul>

      <div className="py-1">
        <div
          className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
          onClick={handleLogout}
        >
          Sign out
        </div>
      </div>
    </div>
  );
};
