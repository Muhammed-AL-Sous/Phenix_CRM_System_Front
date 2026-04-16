import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

/**
 * @param {object} props
 * @param {{
 *   current_page: number,
 *   total_pages: number,
 *   total_items: number,
 *   from: number | null,
 *   to: number | null,
 *   items_per_page: number,
 * } | null | undefined} props.meta
 * @param {(page: number) => void} props.onPageChange
 * @param {boolean} [props.disabled]
 * @param {'ltr' | 'rtl'} props.dir
 */
export default function UsersPagination({ meta, onPageChange, disabled, dir }) {
  const { t } = useTranslation("user");

  if (!meta || meta.total_pages < 1) return null;

  const { current_page: current, total_pages: last, total_items: total, from, to } = meta;
  const canPrev = current > 1;
  const canNext = current < last;

  const showing =
    from != null && to != null
      ? t("users.list.showing_range", {
          from,
          to,
          total,
        })
      : t("users.list.showing_total", { total });

  /** في RTL يزداد رقم الصفحة نحو اليسار؛ الأيقونات تنعكس لتطابق اتجاه «التالي/السابق » */
  const isRtl = dir === "rtl";

  return (
    <div
      dir={dir}
      className="mt-4 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90 sm:flex-row sm:items-center"
    >
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 sm:text-start">
        {showing}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <NavIcon
          label={t("users.list.first_page")}
          onClick={() => onPageChange(1)}
          disabled={disabled || !canPrev}
        >
          {isRtl ? (
            <ChevronsRight className="size-4" aria-hidden />
          ) : (
            <ChevronsLeft className="size-4" aria-hidden />
          )}
        </NavIcon>
        <NavIcon
          label={t("users.list.prev_page")}
          onClick={() => onPageChange(current - 1)}
          disabled={disabled || !canPrev}
        >
          {isRtl ? (
            <ChevronRight className="size-4" aria-hidden />
          ) : (
            <ChevronLeft className="size-4" aria-hidden />
          )}
        </NavIcon>

        <span className="min-w-32 px-2 text-center text-sm font-medium tabular-nums text-slate-700 dark:text-slate-200">
          {t("users.list.page_status", { current, last })}
        </span>

        <NavIcon
          label={t("users.list.next_page")}
          onClick={() => onPageChange(current + 1)}
          disabled={disabled || !canNext}
        >
          {isRtl ? (
            <ChevronLeft className="size-4" aria-hidden />
          ) : (
            <ChevronRight className="size-4" aria-hidden />
          )}
        </NavIcon>
        <NavIcon
          label={t("users.list.last_page")}
          onClick={() => onPageChange(last)}
          disabled={disabled || !canNext}
        >
          {isRtl ? (
            <ChevronsLeft className="size-4" aria-hidden />
          ) : (
            <ChevronsRight className="size-4" aria-hidden />
          )}
        </NavIcon>
      </div>
    </div>
  );
}

function NavIcon({ children, onClick, disabled, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-sky-400 hover:bg-sky-50 dark:hover:border-sky-600 dark:hover:bg-zinc-800",
      )}
    >
      {children}
    </button>
  );
}
