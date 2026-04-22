import { useTranslation } from "react-i18next";

import { RevealSection } from "../components/utility/RevealSection";

export default function WhatIsNewPage() {
  const { t } = useTranslation("navbar");

  return (
    <RevealSection
      className="relative mx-auto max-w-4xl overflow-x-hidden px-4 py-14 sm:py-20
        dark:bg-linear-to-b dark:from-black/60 dark:via-black/40 dark:to-black/60"
    >
      <h1
        className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl
          dark:text-white"
      >
        {t("what's_new")}
      </h1>
      <p
        className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg
          dark:text-slate-300"
      >
        {t("whats_new_lead")}
      </p>
    </RevealSection>
  );
}
