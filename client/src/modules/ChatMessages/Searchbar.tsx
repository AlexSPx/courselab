import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Avatar from "../../components/Avatar";
import useDebounce from "../../Hooks/useDebounce";
import useOnOutsideClick from "../../Hooks/useOnOutsideClick";
import { GeneralUserInformation } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";

export default function Searchbar() {
  const [query, setQuery] = useState<string>();
  const [users, setUsers] = useState<GeneralUserInformation[] | null>(null);
  const [dropdown, setDropdown] = useState(false);

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, () => setDropdown(false));

  const debouncedValue = useDebounce(query);

  const mapUsers = users?.map((user) => {
    return <RenderUser key={user.id} user={user} />;
  });

  useEffect(() => {
    const executeQuery = async () => {
      if (!query) {
        setUsers(null);
        return;
      }
      try {
        const res = await axios.get(`${baseurl}/chatroom/search/${query}`, {
          withCredentials: true,
        });

        setUsers(res.data.length ? res.data : []);
      } catch (error) {}
    };
    executeQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="block w-full overflow-hidden p-2" ref={wrapperRef}>
      <input
        type="text"
        className="input input-ghost input-bordered bg-white shadow-sm w-full"
        placeholder="Enter @ + username"
        onFocus={() => setDropdown(true)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setQuery(e.target.value);
        }}
      />
      {dropdown && (
        <div className="flex flex-col absolute w-[25.2rem] max-w-2xl mt-[1px] p-2 border rounded bg-white z-10">
          <p className="c animate-pulse">Searching...</p>
          <div className="border-b my-1"></div>
          <div className="flex flex-col">{mapUsers}</div>
        </div>
      )}
    </div>
  );
}

const RenderUser = ({ user }: { user: GeneralUserInformation }) => {
  const { push } = useRouter();

  return (
    <div
      className="flex flex-row items-center justify-between cursor-pointer rounded-lg hover:bg-gray-100 p-1 my-1"
      onClick={() => push(`/messages/direct?to=${user.username}`)}
    >
      <div className="flex flex-row items-center">
        <div className="relative h-14 w-14">
          <Avatar user={user} />
        </div>
        <div className="flex flex-col ml-3 leading-3">
          <p className="text-lg font-semithin">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-gray-400 italic">@{user.username}</p>
          <p className="text-gray-400 text-sm italic">email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};
