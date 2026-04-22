import Lottie from "lottie-react";

import loadingDots from "../../assets/loaders/Loading_Dots.json";

/** حجم ثابت للّوتي */
const FULLSCREEN_LOTTIE_PX = 140;

/** مكوّن Lottie مشترك — يُبقى mounted حتى لا تتوقف الحركة عند إخفاء الطبقة */
export function LottieDotsPlayer({ className = "" }) {
  const box = `${FULLSCREEN_LOTTIE_PX}px`;

  return (
    <div
      className={["shrink-0 overflow-hidden", className].filter(Boolean).join(" ")}
      style={{ width: box, height: box }}
      aria-hidden
    >
      <Lottie
        animationData={loadingDots}
        loop
        className="block"
        style={{
          width: box,
          height: box,
          maxWidth: box,
          maxHeight: box,
        }}
      />
    </div>
  );
}

/**
 * شاشة تحميل كاملة (استخدام نادر — الطبقة الموحّدة هي AppBlockingOverlay)
 */
export default function GlobalLoader({ message, className = "" }) {
  return (
    <div
      className={[
        "fixed inset-0 z-10000",
        "flex flex-col items-center justify-center gap-4",
        "bg-[#f8fafc] dark:bg-[#18181b]",
        className,
      ].join(" ")}
    >
      <LottieDotsPlayer />
      {message ? (
        <p className="max-w-sm px-4 text-center text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          {message}
        </p>
      ) : null}
    </div>
  );
}
