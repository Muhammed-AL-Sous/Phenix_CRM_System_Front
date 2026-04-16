const SIZE_CLASS = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const VARIANT_CLASS = {
  primary: "border-red-500 border-t-transparent",
  onPrimary: "border-white border-t-transparent",
};

export function Spinner({
  size = "md",
  variant = "primary",
  className = "",
  ...rest
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "inline-block shrink-0 rounded-full animate-spin",
        SIZE_CLASS[size] ?? SIZE_CLASS.md,
        VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
        className,
      ].join(" ")}
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
      className={[
        "fixed inset-0 z-9999",
        "flex items-center justify-center",
        "bg-slate-50 dark:bg-zinc-900",
        className,
      ].join(" ")}
    >
      <div className="text-center px-4">
        <Spinner size="lg" className="mx-auto block" />
        {message ? (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
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
