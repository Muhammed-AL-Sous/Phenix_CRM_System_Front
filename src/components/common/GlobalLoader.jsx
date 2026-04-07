import React from "react";

const SIZE_CLASS = {
  sm: "w-6 h-6 border-[3px]",
  md: "w-10 h-10 border-4",
  lg: "w-12 h-12 border-4",
};

const VARIANT_CLASS = {
  primary: "border-red-500 border-t-transparent",
  onPrimary: "border-white border-t-transparent",
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
  return (
    <span
      role="status"
      aria-hidden="true"
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
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-slate-50 dark:bg-zinc-900 ${className}`}
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

/** إزالة لودر الـ HTML الأولي (#initial-loader) بعد أن يتحكم React بالواجهة */
export function removeInitialLoader() {
  const el = document.getElementById("initial-loader");
  if (el?.parentNode) {
    el.remove();
  }
}
