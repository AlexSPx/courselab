import axios from "axios";
import { TFunction } from "react-i18next";
import React, { useRef, useState } from "react";
import Modal from "..";
import useOnOutsideClick from "../../../Hooks/useOnOutsideClick";
import { UserInformation } from "../../../interfaces";
import { baseurl } from "../../../lib/fetcher";
import useRequest from "../../../lib/useRequest";
import { CloseIcon } from "../../../svg/small";
import { Field } from "../../Inputs/Field";
import ImageSelector from "../../Inputs/ImageSelector";

export default function EditUser({
  user,
  onClose,
  t,
}: {
  user: UserInformation;
  onClose: Function;
  t: TFunction<"control_panel", undefined>;
}) {
  const [avatarChange, setAvatarChange] = useState<File>();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);

  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [isActive, setIsActive] = useState(user.isActive);
  const [isVerified, setIsVerified] = useState(user.isVerified);

  const wrapperRef = useRef(null);
  useOnOutsideClick(wrapperRef, () => onClose());

  const { executeQuery } = useRequest();

  const handleSaveChanges = () => {
    const changes = {
      first_name: firstName,
      last_name: lastName,
      isAdmin,
      isActive,
      isVerified,
    };

    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/admin/save/user/${user.username}`,
          changes,
          {
            withCredentials: true,
          }
        );

        return res;
      },
      {
        loadingTitle: "Account Update",
        loadingBody: "Saving changes...",
        successBody: "Changes have been saved",
      }
    );

    if (avatarChange) {
      executeQuery(
        async () => {
          const avatartData = new FormData();
          avatartData.append("avatar", avatarChange);

          const res = await axios.post(
            `${baseurl}/user/avatar/${user.username}`,
            avatartData,
            { withCredentials: true }
          );

          return res;
        },
        {
          loadingTitle: "Uploading image",
          successBody: "Uploaded",
        }
      );
    }
  };

  return (
    <Modal>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 bg-opacity-[.16]">
        <div
          className="flex flex-col w-11/12 sm:w-5/6 lg:w-2/3 max-w-4xl mx-auto rounded-lg border border-gray-300 bg-gray-50 shadow-xl overflow-auto"
          ref={wrapperRef}
        >
          <div className="flex flex-row justify-between p-3 border-b bg-white max-h-[60%]">
            <span className="font-semibold label">
              {t("profile", { username: user.username })}
            </span>
            <div
              className="flex h-10 w-10  items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer"
              onClick={() => onClose()}
            >
              <CloseIcon />
            </div>
          </div>
          <section className="flex flex-col px-6 py-5 bg-gray-50">
            <div className="flex flex-col w-full items-center justify-center">
              <div className="flex flex-col md:flex-row w-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24">
                    <ImageSelector
                      image={avatarChange}
                      setImage={setAvatarChange}
                      shape="circle"
                      previewN={`${baseurl}/user/avatars/${user.username}.jpg`}
                    />
                  </div>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>

                <div className="flex flex-col mx-3 w-1/3">
                  <Field
                    type="text"
                    data={firstName}
                    setData={setFirstName}
                    placeholder={t("first-name", { ns: "common" })}
                    css="my-1"
                  />
                  <Field
                    type="text"
                    data={lastName}
                    setData={setLastName}
                    placeholder={t("last-name", { ns: "common" })}
                    css="my-1"
                  />
                </div>
                <div className="flex flex-col mx-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text mr-4">
                        {t("admin")} ({isAdmin.toString()}):
                      </span>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text mr-4">
                        {t("verified")} ({isVerified.toString()}):
                      </span>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text mr-4">
                        {t("active")} ({isActive.toString()}):
                      </span>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-outline w-96 mt-3"
                onClick={handleSaveChanges}
              >
                {t("save-changes", { ns: "common" })}
              </button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}
