import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  useModals,
  LoadingModal,
  SuccessModal,
  ErrorModal,
} from "../../components/Modal";
import SeoTags from "../../components/SeoTags";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { EmailIcon, PasswordIcon } from "../../svg/small";

export const LoginPage: NextPage = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { t } = useTranslation("login");
  const { pushModal, closeModal } = useModals();
  const { push } = useRouter();

  const handleLogin = async () => {
    const key = Date.now();
    pushModal(
      <LoadingModal
        key={key}
        title="Logging in"
        body="Verifying credentials"
      />,
      { timer: false }
    );

    try {
      await axios.post(
        `${baseurl}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      closeModal(key);
      pushModal(
        <SuccessModal title="Redirecting" body="Logged in successfully" />
      );

      setTimeout(() => {
        push("/home");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        closeModal(key);
        pushModal(
          <ErrorModal title="Error" body={`${error.response?.data}`} />
        );
      }
    }
  };
  return (
    <div
      className="flex w-full h-full items-center justify-center"
      onKeyDown={(e) => {
        if (e.key === "Enter") handleLogin();
      }}
    >
      <SeoTags title="CourseLab | Login" description="CourseLab login page" />
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
        <h1 className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
          {t("h1")}
        </h1>
        <div className="mt-8">
          <div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  id="sign-in-email"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={t("email")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <PasswordIcon />
                </span>
                <input
                  type="password"
                  id="sign-in-password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={t("password")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex items-center mb-6 -mt-4">
              <div className="flex ml-auto">
                <Link href="/forgotpassword">
                  <a className="inline-flex text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white">
                    {t("forgot-password")}
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex w-full">
              <button
                onClick={() => handleLogin()}
                id="sign-in-button"
                className="btn btn-primary w-full"
                aria-label="login"
              >
                {t("login")}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-6">
          <Link href="/register">
            <a className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white">
              <span className="ml-2">{t("no-account")}</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    return {
      props: {
        user: req.user || null,
        ...(await serverSideTranslations(locale!, ["common", "login"])),
      },
    };
  },
  {
    requiresAuth: false,
  }
);
