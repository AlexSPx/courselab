import axios from "axios";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { TFunction } from "react-i18next";
import useSWR from "swr";
import Avatar from "../../components/Avatar";
import { useModals } from "../../components/Modal";
import EditUser from "../../components/Modal/Menus/EditUser";
import useDebounce from "../../Hooks/useDebounce";
import { UserInformation } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";

export default function Page() {
  const { t } = useTranslation("control_panel");
  return (
    <>
      <h1 className="text-3xl mt-3 text-center">{t("control-panel")}</h1>
      <Counts t={t} />
      <AdminAccounts t={t} />
      <ManageAccounts t={t} />
    </>
  );
}

const Counts = ({ t }: { t: TFunction<"control_panel", undefined> }) => {
  const [users, setUsers] = useState(0);
  const [courses, setCourses] = useState(0);
  useSWR(`${baseurl}/admin/count`, {
    onSuccess: (data) => {
      setUsers(data.users);
      setCourses(data.courses);
    },
  });

  return (
    <div className="stats shadow mt-6 min-h-[7.5rem]">
      <div className="stat place-items-center">
        <div className="stat-title">{t("users")}</div>
        <div className="stat-value text-secondary">{users}</div>
        <div className="stat-desc text-secondary">{t("reg-users")}</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">{t("courses")}</div>
        <div className="stat-value">{courses}</div>
        <div className="stat-desc">{t("pub-courses")}</div>
      </div>
    </div>
  );
};

const AdminAccounts = ({ t }: { t: TFunction<"control_panel", undefined> }) => {
  const [admins, setAdmins] = useState<UserInformation[]>();

  useSWR(`${baseurl}/admin/accounts`, {
    onSuccess: (data) => {
      setAdmins(data);
    },
  });

  const User = ({ user }: { user: UserInformation }) => {
    return (
      <tr>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <Avatar user={user} />
              </div>
            </div>
            <div>
              <div className="font-bold">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-sm opacity-50">@{user.username}</div>
            </div>
          </div>
        </td>
        <td>
          {user.socials?.location ? (
            <>
              {user.socials?.location.country}, {user.socials?.location.city}
            </>
          ) : (
            "-"
          )}
          <br />
          <span className="badge badge-ghost badge-sm">
            {t("general-admin")}
          </span>
        </td>
        <td>True</td>
        <th>
          <button className="btn btn-ghost btn-xs">{t("details")}</button>
        </th>
      </tr>
    );
  };

  const mapAdmins = admins?.map((admin) => {
    return <User user={admin} key={admin.id} />;
  });

  return (
    <div className="flex flex-col items-center mt-4">
      <h3 className="text-lg my-2">Admin Accounts</h3>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("reg-date")}</th>
              <th>{t("is-admin")}</th>
              <th />
            </tr>
          </thead>
          <tbody>{mapAdmins}</tbody>
        </table>
      </div>
    </div>
  );
};

const ManageAccounts = ({
  t,
}: {
  t: TFunction<"control_panel", undefined>;
}) => {
  const [query, setQuery] = useState<string>();
  const [users, setUsers] = useState<UserInformation[] | null>(null);
  const debouncedValue = useDebounce(query);
  const { pushModal, closeModal } = useModals();
  useEffect(() => {
    const executeQuery = async () => {
      if (!query) {
        setUsers(null);
        return;
      }
      try {
        const res = await axios.post(
          `${baseurl}/admin/query`,
          { query },
          { withCredentials: true }
        );
        setUsers(res.data);
        // mutate(`${baseurl}/doc/${document.id}`);
      } catch (error) {
        setUsers(null);
      }
    };
    executeQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const mapUsers =
    users &&
    (users.length ? (
      users.map((user) => {
        return (
          <RenderUser
            t={t}
            user={user}
            key={user.id}
            pushModal={pushModal}
            closeModal={closeModal}
          />
        );
      })
    ) : (
      <>{t("no-user")}</>
    ));

  return (
    <section className="flex flex-col items-center mt-4">
      <h3 className="text-lg my-2">{t("manage-accounts")}</h3>
      <input
        type="text"
        className="input input-ghost input-bordered bg-white shadow-sm w-full max-w-2xl"
        placeholder={t("searchbar-msg")}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setQuery(e.target.value);
        }}
      />
      <div
        className="flex flex-col items-center w-full max-h-[24rem] mt-3 overflow-auto"
        id="journal-scroll"
      >
        {mapUsers}
      </div>
    </section>
  );
};

const RenderUser = ({
  user,
  pushModal,
  closeModal,
  t,
}: {
  user: UserInformation;
  pushModal: any;
  closeModal: any;
  t: TFunction;
}) => {
  const handleOpenUser = () => {
    const mkey = Date.now();
    pushModal(
      <EditUser
        t={t}
        user={user}
        onClose={() => closeModal(mkey)}
        key={mkey}
      />,
      { timer: false }
    );
  };

  return (
    <div
      className="flex flex-row my-2 p-2 w-full max-w-2xl rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={handleOpenUser}
    >
      <div className="relative w-24 h-24">
        <Avatar user={user} />
      </div>
      <div className="flex flex-col mx-2 h-full justify-center">
        <h4 className="text-lg">
          {user.first_name} {user.last_name}
        </h4>
        <p className="text-gray-500 text-sm">@{user.username}</p>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-row">
          <p className="px-1">{t("verified")}:</p>
          <p className="font-bold">{user.isVerified.toString()}</p>
        </div>
        <div className="flex flex-row">
          <p className="px-1">{t("active")}:</p>
          <p className="font-bold">{user.isActive.toString()}</p>
        </div>
        <div className="flex flex-row">
          <p className="px-1">{t("admin")}:</p>
          <p className="font-bold">{user.isAdmin.toString()}</p>
        </div>
      </div>
    </div>
  );
};
