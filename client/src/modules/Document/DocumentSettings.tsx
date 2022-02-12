import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useHasImage from "../../Hooks/useHasImage";
import useOnlineQuery from "../../Hooks/useOnlineQuery";
import {
  DocumentInterface,
  DocumentUser,
  GeneralUserInformation,
} from "../../interfaces";
import { DownArrow, UpArrow } from "../../svg/small";
import { Right } from "../Layouts/MainLayout";
import Image from "next/image";
import Avatar from "../../components/Avatar";
import { useModals } from "../../components/Modal";
import AddMember from "./AddMember";

export default function DocumentSettings({
  doc,
  UsersInDoc,
}: {
  doc: DocumentInterface;
  UsersInDoc: GeneralUserInformation[];
}) {
  const [showMembers, setShowMembers] = useState(false);

  const { pushModal, closeModal } = useModals();

  const render = UsersInDoc.slice(0, 3).map((docUser) => {
    return (
      <div className="avatar" key={docUser.id}>
        <div className="h-14 w-14">
          <Avatar user={docUser} />
        </div>
      </div>
    );
  });

  const addMember = () => {
    const akey = Date.now();

    pushModal(
      <AddMember onClose={() => closeModal(akey)} document={doc} key={akey} />,
      {
        timer: false,
      }
    );
  };

  const getDocUsers = useCallback(() => {
    const docUsers: DocumentUser[] = [...doc.members];

    if (doc.courseDataModel) {
      doc.courseDataModel.course.members.forEach((mmbr) => {
        if (mmbr.role === "ADMIN") return;
        docUsers.push({
          user: mmbr.user,
          role: "READER",
          AssignedAt: new Date(),
        });
      });
    }
    return docUsers;
  }, [doc.courseDataModel, doc.members]);

  const docUsers = useMemo(() => getDocUsers(), [getDocUsers]);
  return (
    <Right css="sticky right-0 top-0 w-1/5 overflow-hidden">
      <div className="flex flex-col items-center w-5/6 h-12">
        <div className="-space-x-6 avatar-group overflow-visible mt-4">
          {render}

          {UsersInDoc.length > 3 && (
            <div className="avatar placeholder">
              <div className="w-14 h-14 rounded-full bg-neutral-focus text-neutral-content">
                <span>+{UsersInDoc.length - 3}</span>
              </div>
            </div>
          )}
        </div>

        <div className="divider w-full"></div>
        <DropDown
          state={showMembers}
          setState={setShowMembers}
          label="Show Members"
        />
        {showMembers && (
          <>
            <Members docUsers={docUsers} />
            <button
              className="btn btn-sm btn-outline w-full h-2"
              onClick={addMember}
            >
              Add Member
            </button>
          </>
        )}
      </div>
    </Right>
  );
}

const DropDown = ({
  state,
  setState,
  label,
}: {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
}) => {
  return (
    <div
      className="flex mt-4 my-1 px-2 rounded-md hover:bg-gray-100 w-full justify-between items-center cursor-pointer"
      onClick={() => setState(!state)}
    >
      <p className="label label-text text-lg">{label}</p>
      {state ? <UpArrow css="mr-1" /> : <DownArrow css="mr-1" />}
    </div>
  );
};

const Members = ({ docUsers }: { docUsers: DocumentUser[] }) => {
  const ids = docUsers.map((docUser) => docUser.user.id);
  const { onlineUsers } = useOnlineQuery(ids, 3000);

  const renderUsers = docUsers.map((docUser) => {
    const isOnline = onlineUsers.some((user) => user.id === docUser.user.id);

    return (
      <Member docUser={docUser} isOnline={isOnline} key={docUser.user.id} />
    );
  });

  return <div className="flex flex-col w-full my-1 px-2">{renderUsers}</div>;
};

const Member = ({
  docUser,
  isOnline,
}: {
  docUser: DocumentUser;
  isOnline: boolean;
}) => {
  const { url } = useHasImage(`${docUser.user.username}`, {
    avatar: `${docUser.user.first_name}-${docUser.user.last_name}`,
    type: "avatar",
  });

  return (
    <div className="flex flex-row my-1 py-1 px-2 rounded-md select-none hover:bg-gray-100 cursor-pointer">
      <div
        className={`flex relative h-14 w-14 avatar ${
          isOnline ? "online" : "offline"
        }`}
      >
        <Image
          src={url}
          alt="Avatar"
          layout="fill"
          className="rounded-full"
          priority
        />
      </div>
      <div className="flex flex-col justify-center mx-3">
        <p className="flex flex-row">
          {docUser.user.first_name} {docUser.user.last_name}
        </p>
        {docUser.role === "ADMIN" && <p className="text-sm">Administrator</p>}
      </div>
    </div>
  );
};
