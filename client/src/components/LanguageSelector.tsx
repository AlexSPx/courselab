import { useRouter } from "next/router";
import React from "react";

export default function LanguageSelector() {
  const { locale, push, pathname, query, asPath } = useRouter();
  const setLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    push({ pathname, query }, asPath, { locale: e.target.value });
  };
  return (
    <select
      className="select select-bordered w-[6rem] select-xs max-w-xs"
      onChange={setLocale}
    >
      <option selected={locale === "en" ? true : false} value="en">
        English
      </option>
      <option selected={locale === "bg" ? true : false} value="bg">
        Bulgarian
      </option>
    </select>
  );
}
