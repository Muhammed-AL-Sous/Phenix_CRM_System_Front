import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { cn } from "./utils";

/** أثناء ضبط التنسيقات: اجعلها `true` — التوست لا يُغلق تلقائياً (`Infinity`). ثم أعدها `false`. */
const TOAST_STAY_OPEN_FOR_STYLING = false;
const TOAST_DURATION_MS = 4000;

/**
 * تنسيقات Phenix: خلفية موحّدة لكل التوست مع حدود متساوية حول الصندوق (بدون شريط جانبي ملوّن).
 * يُركَّب مرة واحدة في `main.jsx`.
 */
const SonnerToaster = () => {
  const { mode, direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  const font = isRtl ? "font-[Almarai]" : "font-[Livvic]";

  const shell = cn(
    "relative flex items-center w-full max-w-[420px] gap-2 p-4",
    "rounded-2xl shadow-lg backdrop-blur-md",
    "text-[14px] leading-snug",
    font,
  );

  const duration = TOAST_STAY_OPEN_FOR_STYLING ? Infinity : TOAST_DURATION_MS;

  return (
    <Toaster
      position={isRtl ? "bottom-left" : "bottom-right"}
      duration={duration}
      closeButton={TOAST_STAY_OPEN_FOR_STYLING}
      theme={mode === "dark" ? "dark" : "light"}
      dir={direction}
      toastOptions={{
        duration,
        unstyled: true,
        classNames: {
          toast: shell,
          title: "font-semibold text-[0.9375rem] text-inherit pr-1",
          description: "text-[13px] opacity-90 mt-1 text-inherit",
          content: "flex-1 min-w-0 pt-0.5",
          icon: cn(
            "mt-0.5 shrink-0 [&_svg]:size-[25px] [&_svg]:shrink-0",
            "opacity-95",
          ),
          closeButton: cn(
            "border-0 bg-black/[0.06] dark:bg-white/[0.08]",
            "hover:bg-black/[0.1] dark:hover:bg-white/[0.12] rounded-lg",
          ),
          success: cn(
            "border border-emerald-200/90 dark:border-emerald-500/35",
            "bg-emerald-50 text-emerald-950",
            "dark:bg-emerald-950/55 dark:text-emerald-50",
            "[&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
          ),
          error: cn(
            "border border-red-200/90 dark:border-red-500/35",
            "bg-red-50 text-red-950",
            "dark:bg-red-950/55 dark:text-red-50",
            "[&_[data-icon]]:text-[#dc2626] dark:[&_[data-icon]]:text-red-400",
          ),
          warning: cn(
            "border border-amber-200/90 dark:border-amber-500/35",
            "bg-amber-50 text-amber-950",
            "dark:bg-amber-950/55 dark:text-amber-50",
            "[&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
          ),
          info: cn(
            "border border-slate-200/90 dark:border-slate-500/35",
            "bg-slate-50 text-slate-900",
            "dark:bg-slate-900/90 dark:text-slate-100",
            "[&_[data-icon]]:text-blue-600 dark:[&_[data-icon]]:text-blue-400",
          ),
          loader: "text-slate-600 dark:text-slate-300",
          loading: cn(
            "border border-slate-200/90 dark:border-slate-600/45",
            "bg-white text-slate-800",
            "dark:bg-zinc-900 dark:text-zinc-100",
          ),
          default: cn(
            "border border-slate-200/90 dark:border-zinc-600/40",
            "bg-white text-slate-800",
            "dark:bg-zinc-900 dark:text-zinc-100",
          ),
        },
      }}
    />
  );
};

export default SonnerToaster;
