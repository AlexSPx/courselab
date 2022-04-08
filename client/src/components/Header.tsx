import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { AiOutlineGithub } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { useTranslation } from "next-i18next";
import LanguageSelector from "./LanguageSelector";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);

  const router = useRouter();

  const { t } = useTranslation("common");

  return (
    <header className="lg:h-24 xl:h-24 2xl:h-24 flex items-center z-30 w-full flex-col justify-center mt-3">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
          <Link href="/">
            <a>CourseLab</a>
          </Link>
        </div>
        <div className="flex items-center">
          <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
            <Location
              label={t("header-home")}
              to="/"
              active={router.pathname === "/" ? true : false}
            />
            <Location
              label={t("header-faqs")}
              to="/faqs"
              active={router.pathname === "/faqs" ? true : false}
            />
            <Location
              label={t("header-courses")}
              to="/courses"
              active={router.pathname === "/courses" ? true : false}
            />
            <Location
              label={t("header-login")}
              to="/login"
              active={router.pathname === "/login" ? true : false}
            />
            <Location
              label={t("header-register")}
              to="/register"
              active={router.pathname === "/register" ? true : false}
            />
            <Link href={`https://github.com/alexspx/courselab`}>
              <a
                className={`py-2 px-6 flex items-center hover:text-indigo-500`}
                target="_blank"
              >
                <AiOutlineGithub size={24} className="mx-1" />
                GitHub
              </a>
            </Link>
            <LanguageSelector />
          </nav>
          <button
            className="flex md:hidden flex-col ml-4"
            onClick={() => setDropdown(!dropdown)}
            aria-label="Header dropdown"
          >
            <GiHamburgerMenu size={28} />
          </button>
        </div>
      </div>
      {dropdown && (
        <div className="flex lg:hidden  flex-col">
          <LocationMobile
            label={t("header-home")}
            to="/"
            active={router.pathname === "/" ? true : false}
          />
          <LocationMobile
            label={t("header-courses")}
            to="/courses"
            active={router.pathname === "/about" ? true : false}
          />
          <LocationMobile
            label={t("header-faqs")}
            to="/faqs"
            active={router.pathname === "/docs" ? true : false}
          />
          <LocationMobile
            label={t("header-login")}
            to="/login"
            active={router.pathname === "/login" ? true : false}
          />
          <LocationMobile
            label={t("header-register")}
            to="/register"
            active={router.pathname === "/register" ? true : false}
          />
          <br />
        </div>
      )}
    </header>
  );
}

const Location = ({
  label,
  to,
  active,
}: {
  label: string;
  to: string;
  active: boolean;
}) => {
  return (
    <Link href={to} passHref={true}>
      <a
        className={`py-2 px-6 flex hover:text-indigo-500 ${
          active && "text-indigo-500 border-b-2 border-indigo-500"
        }`}
      >
        {label}
      </a>
    </Link>
  );
};

const LocationMobile = ({
  label,
  to,
  active,
}: {
  label: string;
  to: string;
  active: boolean;
}) => {
  return (
    <Link href={to} passHref={true}>
      <a
        className={`py-2 px-6 flex hover:text-indigo-500 justify-center ${
          active && "text-indigo-500 border-b-2 border-indigo-500"
        }`}
      >
        {label}
      </a>
    </Link>
  );
};
