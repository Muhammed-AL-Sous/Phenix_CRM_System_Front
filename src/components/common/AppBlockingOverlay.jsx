import { useSelector } from "react-redux";

import { selectAppBlockingOverlay } from "../../store/Slices/uiSlice";
import { LottieDotsPlayer } from "./GlobalLoader.jsx";

/**
 * طبقة Lottie واحدة لكل التطبيق — تبقى mounted وتُظهر/تُخفى بالشفافية
 * حتى لا يُعاد تشغيل الأنيميشن عند تسلسل (Suspense ثم مصادقة ثم مسار).
 */
export default function AppBlockingOverlay() {
  const show = useSelector(selectAppBlockingOverlay);

  return (
    <div
      className={[
        "fixed inset-0 z-[10001] flex flex-col items-center justify-center gap-4",
        "bg-[#f8fafc] dark:bg-[#18181b]",
        "transition-opacity duration-200 ease-out",
        show ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!show}
      aria-busy={show || undefined}
      aria-live="polite"
    >
      <div
        className="shrink-0"
        role={show ? "status" : undefined}
        aria-label={show ? "Loading" : undefined}
      >
        <LottieDotsPlayer />
      </div>
    </div>
  );
}
