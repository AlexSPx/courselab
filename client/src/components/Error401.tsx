import { useTranslation } from "next-i18next";
import React from "react";

export default function Error401() {
  const { t } = useTranslation();
  return (
    <div className="flex w-full h-full items-center justify-center">
      <p className="font-semibold text-2xl uppercase">
        <p className="text-center text-8xl">401</p>
        {t("401-p1")}
        <br />
        {t("401-p2")}
      </p>
    </div>
  );
}
