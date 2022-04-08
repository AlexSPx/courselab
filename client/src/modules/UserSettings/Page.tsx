import axios from "axios";
import { useTranslation } from "next-i18next";
import React, { useContext, useState } from "react";
import { Field } from "../../components/Inputs/Field";
import ImageSelector from "../../components/Inputs/ImageSelector";
import { UserContext } from "../../contexts/UserContext";
import useHasImage from "../../Hooks/useHasImage";
import { baseurl } from "../../lib/fetcher";
import useRequest from "../../lib/useRequest";
import { Main } from "../Layouts/MainLayout";

export default function Page() {
  const { userData } = useContext(UserContext);
  const [image, setImage] = useState<File | undefined>();
  const { url } = useHasImage(`${userData?.user?.username}`, {
    avatar: `${userData?.user?.first_name}-${userData?.user?.last_name}`,
    type: "avatar",
    width: 300,
    height: 300,
  });

  const { t } = useTranslation();

  const { executeQuery } = useRequest();

  const handleChangeAvatar = () => {
    if (!image) return;
    executeQuery(
      async () => {
        const avatartData = new FormData();
        avatartData.append("avatar", image);

        const res = await axios.post(
          `${baseurl}/user/avatar/${userData?.user?.username}`,
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
  };

  const handleGeneralSettings = () => {
    executeQuery(
      async () => {
        const res = await axios.post(
          `${baseurl}/user/changes`,
          { first_name: firstName, last_name: lastName },
          { withCredentials: true }
        );

        return res;
      },
      {
        loadingTitle: "Saving changes",
        successTitle: "Success",
      }
    );
  };

  const [firstName, setFirstName] = useState(userData?.user?.first_name);
  const [lastName, setLastName] = useState(userData?.user?.last_name);

  return (
    <Main css="flex max-w-3xl items-center">
      <h1 className="text-2xl font-bold">{t("user-settings")}</h1>
      <section className="flex items-center mt-5 border border-gray-300 rounded w-full p-2 justify-between">
        <div className="flex items-center">
          <div className="relative h-24 w-24 mx-3">
            <ImageSelector
              image={image}
              setImage={setImage}
              previewN={url}
              shape="circle"
            />
          </div>
          <h3 className="font-semibold text-xl">{t("change-avatar")}</h3>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleChangeAvatar}>
          {t("upload-image")}
        </button>
      </section>
      <div className="divider w-full font-semibold text-xl">
        {t("general-settings")}
      </div>
      <section className="w-full">
        <div className="flex">
          <Field
            label={t("first-name")}
            data={firstName}
            setData={setFirstName}
            placeholder={t("first-name")}
            css="mx-1"
          />
          <Field
            label={t("last-name")}
            data={lastName}
            setData={setLastName}
            placeholder={t("last-name")}
            css="mx-1"
          />
        </div>
      </section>
      <button
        className="btn btn-outline mt-3 w-full"
        onClick={handleGeneralSettings}
      >
        {t("save-changes")}
      </button>
    </Main>
  );
}
