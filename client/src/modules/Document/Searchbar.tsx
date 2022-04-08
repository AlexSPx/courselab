import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import useDebounce from "../../Hooks/useDebounce";
import { DocumentInterface, GeneralUserInformation } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { CheckIcon, CloseIcon, ErrorIcon } from "../../svg/small";
import Avatar from "../../components/Avatar";
import { ErrorModal, useModals } from "../../components/Modal";
import { useTranslation } from "next-i18next";
import { TFunction } from "react-i18next";

export default function Searchbar({
  document,
}: {
  document: DocumentInterface;
}) {
  const [dropdown, setDropdown] = useState(false);
  const [query, setQuery] = useState<string>();
  const [users, setUsers] = useState<GeneralUserInformation[]>([]);

  const { mutate } = useSWRConfig();
  const { pushModal } = useModals();
  const { t } = useTranslation("docs");
  const debouncedValue = useDebounce(query);

  useEffect(() => {
    const executeQuery = async () => {
      if (!query) {
        setUsers([]);
        return;
      }
      try {
        const res = await axios.post(
          `${baseurl}/user/search`,
          { query },
          { withCredentials: true }
        );

        mutate(`${baseurl}/doc/${document.id}`);
        setUsers(res.data);
      } catch (error) {
        pushModal(<ErrorModal title="Error" body={`${error}`} />);
      }
    };
    executeQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const renderUsers = users.map((user) => {
    return (
      <SearchBarUserDisplay
        user={user}
        docId={document.id}
        key={user.id}
        t={t}
      />
    );
  });

  return (
    <div className="block w-full overflow-hidden">
      <input
        type="text"
        className="input input-ghost input-bordered bg-white shadow-sm w-full"
        placeholder={t("document-search")}
        onFocus={() => setDropdown(true)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setQuery(e.target.value);
        }}
      />
      {dropdown && (
        <div className="flex flex-col absolute w-[28rem] max-w-2xl mt-[1px] p-2 bg-white border rounded">
          <p className="c animate-pulse">
            {t("searching", { ns: "common" })}...
          </p>
          <div className="border-b my-1"></div>
          <div className="flex flex-col">{renderUsers}</div>
        </div>
      )}
    </div>
  );
}

const SearchBarUserDisplay = ({
  user,
  docId,
  t,
}: {
  user: GeneralUserInformation;
  docId: string;
  t: TFunction;
}) => {
  const [role, setRole] = useState<"ADMIN" | "EDITOR" | "READER">("EDITOR");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();

  const { mutate } = useSWRConfig();

  const addUser = async () => {
    setLoading(true);
    const res = await axios.post(
      `${baseurl}/doc/adduser`,
      { docId, userId: user.id, role },
      { withCredentials: true }
    );
    setLoading(false);

    if (res.status === 200) setIsSuccess(true);
    else setIsSuccess(false);

    mutate(`${baseurl}/doc/docId`);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <div className="relative h-14 w-14">
          <Avatar user={user} />
        </div>
        <div className="flex flex-col ml-3 leading-3">
          <p className="text-lg font-semithin">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-gray-400 italic">@{user.username}</p>
          <p className="text-gray-400 text-sm italic">
            {t("email", { ns: "common" })}: {user.email}
          </p>
        </div>
      </div>
      <div className="flex">
        <select
          name="role"
          className="mx-2"
          value={role}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setRole(e.target.value as any);
          }}
        >
          <option value="EDITOR">{t("editor")}</option>
          <option value="READER">{t("reader")}</option>
          <option value="ADMIN">{t("admin")}</option>
        </select>
        <button
          className={`btn btn-sm btn-outline ${loading && "loading"}`}
          onClick={() => addUser()}
          aria-label="add"
        >
          {typeof isSuccess !== "undefined" &&
            (isSuccess ? <CheckIcon /> : <CloseIcon />)}
          {t("add")}
        </button>
      </div>
    </div>
  );
};
