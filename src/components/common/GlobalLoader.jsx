const SIZE_CLASS = {
  sm: "w-6 h-6 border-[3px]",
  md: "w-10 h-10 border-4",
  lg: "w-12 h-12 border-4",
};

const VARIANT_CLASS = {
  primary: "border-red-500 border-t-transparent",
  onPrimary: "border-white border-t-transparent",
};

const SIZE_STYLE = {
  sm: { sizePx: 24, borderPx: 3 },
  md: { sizePx: 40, borderPx: 4 },
  lg: { sizePx: 48, borderPx: 4 },
};

const VARIANT_STYLE = {
  primary: { borderColor: "#ef4444", borderTopColor: "transparent" }, // red-500
  onPrimary: { borderColor: "#ffffff", borderTopColor: "transparent" },
};

/**
 * دوّامة موحّدة — للأزرار والتحميل المضمّن
 */
export function Spinner({
  size = "md",
  variant = "primary",
  className = "",
  ...rest
}) {
  const s = SIZE_STYLE[size] ?? SIZE_STYLE.md;
  const v = VARIANT_STYLE[variant] ?? VARIANT_STYLE.primary;
  return (
    <span
      role="status"
      aria-hidden="true"
      style={{
        width: `${s.sizePx}px`,
        height: `${s.sizePx}px`,
        minWidth: `${s.sizePx}px`,
        minHeight: `${s.sizePx}px`,
        borderStyle: "solid",
        borderWidth: `${s.borderPx}px`,
        borderColor: v.borderColor,
        borderTopColor: v.borderTopColor,
      }}
      className={`inline-block rounded-full animate-spin ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    />
  );
}

/**
 * شاشة تحميل كاملة — نفس الشكل في كل التطبيق (بما فيها أول تحميل / الداشبورد)
 */
export default function GlobalLoader({ message, className = "" }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={`z-10000 bg-slate-50 dark:bg-zinc-900 ${className}`}
    >
      <div className="text-center px-4">
        <Spinner size="lg" className="mx-auto block" />
        {message ? (
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * لودر مسارات (Suspense) — داخل منطقة المحتوى فقط، بدون fixed،
 * حتى لا يغطي الشريط الجانبي ولا يعيد وميض الشاشة بعد تسجيل الدخول.
 */
export function RouteSuspenseFallback({ className = "" }) {
  return (
    <div
      className={`flex w-full min-h-[40vh] flex-1 items-center justify-center ${className}`}
    >
      <Spinner size="lg" />
    </div>
  );
}
