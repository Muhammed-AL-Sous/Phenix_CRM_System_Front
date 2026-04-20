import { useMemo, useState } from "react";
import {
  CalendarRange,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Search,
  ArrowDownAZ,
  ArrowDownZA,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import FormListbox from "../../../components/utility/FormListbox";

// Motion Library
import { motion, AnimatePresence } from "motion/react";

const SORT_FIELDS = ["id", "created_at", "name", "email", "role_id"];

/** Maps API `sort` field to `users.list.*` translation suffix */
const SORT_FIELD_I18N = {
  id: "sort_field_id",
  created_at: "sort_field_created_at",
  name: "sort_field_name",
  email: "sort_field_email",
  role_id: "sort_field_role",
};

const PER_PAGE_OPTIONS = [10, 15, 25, 50];

/**
 * @param {object} props
 * @param {string} props.searchInput
 * @param {(v: string) => void} props.onSearchChange
 * @param {string} props.sort
 * @param {(v: string) => void} props.onSortChange
 * @param {string} props.role
 * @param {(v: string) => void} props.onRoleChange
 * @param {'' | 'active' | 'inactive'} props.activeFilter
 * @param {(v: '' | 'active' | 'inactive') => void} props.onActiveFilterChange
 * @param {'' | 'yes' | 'no'} props.verifiedFilter
 * @param {(v: '' | 'yes' | 'no') => void} props.onVerifiedFilterChange
 * @param {string} props.createdFrom
 * @param {string} props.createdTo
 * @param {(v: string) => void} props.onCreatedFromChange
 * @param {(v: string) => void} props.onCreatedToChange
 * @param {number} props.perPage
 * @param {(n: number) => void} props.onPerPageChange
 * @param {() => void} props.onReset
 * @param {'ltr' | 'rtl'} props.dir
 * @param {boolean} [props.hideRoleFilter]
 */
export default function UsersListToolbar({
  searchInput,
  onSearchChange,
  sort,
  onSortChange,
  hideRoleFilter = false,
  role,
  onRoleChange,
  activeFilter,
  onActiveFilterChange,
  verifiedFilter,
  onVerifiedFilterChange,
  createdFrom,
  createdTo,
  onCreatedFromChange,
  onCreatedToChange,
  perPage,
  onPerPageChange,
  onReset,
  dir,
}) {
  const { t } = useTranslation("user");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const dateInputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-100 dark:focus:border-sky-400";

  const labelClass =
    "mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400";

  const sortField = useMemo(() => {
    const raw = String(sort ?? "-id");
    const field = raw.startsWith("-") ? raw.slice(1) : raw;
    return SORT_FIELDS.includes(field) ? field : "id";
  }, [sort]);

  const sortDir = useMemo(() => {
    const raw = String(sort ?? "-id");
    return raw.startsWith("-") ? "desc" : "asc";
  }, [sort]);

  const sortFieldOptions = useMemo(
    () =>
      SORT_FIELDS.map((field) => ({
        id: field,
        name: t(`users.list.${SORT_FIELD_I18N[field]}`),
      })),
    [t],
  );

  const sortDirOptions = useMemo(
    () => [
      {
        id: "asc",
        name: (
          <span
            className="flex items-center"
            aria-label={t("users.list.sort_dir_asc")}
            title={t("users.list.sort_dir_asc")}
          >
            <ArrowDownAZ className="size-5 opacity-80" />
            <span className="sr-only">{t("users.list.sort_dir_asc")}</span>
          </span>
        ),
      },
      {
        id: "desc",
        name: (
          <span
            className="flex items-center"
            aria-label={t("users.list.sort_dir_desc")}
            title={t("users.list.sort_dir_desc")}
          >
            <ArrowDownZA className="size-5 opacity-80" />
            <span className="sr-only">{t("users.list.sort_dir_desc")}</span>
          </span>
        ),
      },
    ],
    [t],
  );

  const roleOptions = useMemo(
    () => [
      { id: "", name: t("users.list.filter_role_all") },
      { id: "admin", name: t("users.role_names.admin") },
      { id: "manager", name: t("users.role_names.manager") },
      { id: "support", name: t("users.role_names.support") },
      { id: "client", name: t("users.role_names.client") },
    ],
    [t],
  );

  const activeOptions = useMemo(
    () => [
      { id: "", name: t("users.list.filter_active_all") },
      { id: "active", name: t("users.list.filter_active_yes") },
      { id: "inactive", name: t("users.list.filter_active_no") },
    ],
    [t],
  );

  const verifiedOptions = useMemo(
    () => [
      { id: "", name: t("users.list.filter_verified_all") },
      { id: "yes", name: t("users.list.filter_verified_yes") },
      { id: "no", name: t("users.list.filter_verified_no") },
    ],
    [t],
  );

  const perPageOptions = useMemo(
    () => PER_PAGE_OPTIONS.map((n) => ({ id: String(n), name: String(n) })),
    [],
  );

  return (
    <div
      dir={dir}
      className="mb-6 space-y-4 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90"
    >
      <div className={clsx("grid grid-cols-1 gap-3 md:grid-cols-4 xl:grid-cols-6")}>
      {/* ===== Search Input ===== */}
        <div className="md:col-span-3 xl:col-span-5 relative">
          <Search
            className={clsx(
              "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-400",
              dir === "rtl" ? "inset-e-3" : "inset-s-3",
            )}
            aria-hidden
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("users.list.search_placeholder")}
            autoComplete="off"
            className={clsx(
              "w-full rounded-xl border border-slate-300 bg-slate-50/80 py-2.5 text-sm text-slate-600 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-1 focus:ring-slate-500/60 dark:focus:ring-red-800/20 dark:focus:border-red-800 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-slate-100 dark:placeholder:text-slate-500",
              dir === "rtl" ? "pe-10 ps-3" : "ps-10 pe-3",
              dir === "rtl" ? "font-[Vazirmatn]" : "Livvic",
            )}
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end ">
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 hover:dark:border-red-500/30 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-red-500/30 duration-200"
          >
            <RotateCcw className="size-4 shrink-0" />
            {t("users.list.reset")}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
          hideRoleFilter ? "xl:grid-cols-6" : "xl:grid-cols-7",
        )}
      >
        <div>
          <label htmlFor="users-sort-field" className={labelClass}>
            {t("users.list.sort_by")}
          </label>
          <FormListbox
            id="users-sort-field"
            value={sortField}
            onChange={(field) => {
              const prefix = sortDir === "desc" ? "-" : "";
              onSortChange(`${prefix}${field}`);
            }}
            options={sortFieldOptions}
            placeholder={t("users.list.sort_by")}
          />
        </div>

        <div>
          <label htmlFor="users-sort-dir" className={labelClass}>
            {t("users.list.sort_direction")}
          </label>
          <FormListbox
            id="users-sort-dir"
            value={sortDir}
            onChange={(dirValue) => {
              const prefix = dirValue === "desc" ? "-" : "";
              onSortChange(`${prefix}${sortField}`);
            }}
            options={sortDirOptions}
            placeholder={t("users.list.sort_direction")}
          />
        </div>

        {!hideRoleFilter ? (
          <div>
            <label htmlFor="users-role" className={labelClass}>
              {t("users.list.filter_role")}
            </label>
            <FormListbox
              id="users-role"
              value={role}
              onChange={(v) => onRoleChange(v)}
              options={roleOptions}
              placeholder={t("users.list.filter_role_all")}
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="users-active" className={labelClass}>
            {t("users.list.filter_active")}
          </label>
          <FormListbox
            id="users-active"
            value={activeFilter}
            onChange={(v) =>
              onActiveFilterChange(
                /** @type {'' | 'active' | 'inactive'} */ (v),
              )
            }
            options={activeOptions}
            placeholder={t("users.list.filter_active_all")}
          />
        </div>

        <div>
          <label htmlFor="users-verified" className={labelClass}>
            {t("users.list.filter_verified")}
          </label>
          <FormListbox
            id="users-verified"
            value={verifiedFilter}
            onChange={(v) =>
              onVerifiedFilterChange(/** @type {'' | 'yes' | 'no'} */ (v))
            }
            options={verifiedOptions}
            placeholder={t("users.list.filter_verified_all")}
          />
        </div>

        <div>
          <label htmlFor="users-per-page" className={labelClass}>
            {t("users.list.per_page")}
          </label>
          <FormListbox
            id="users-per-page"
            value={String(perPage)}
            onChange={(v) => onPerPageChange(Number(v))}
            options={perPageOptions}
            placeholder={t("users.list.per_page")}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
      >
        <Filter className="size-4" />
        {t("users.list.advanced_filters")}
        {advancedOpen ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>

      {advancedOpen ? (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-dashed border-slate-200 p-3 sm:grid-cols-2 dark:border-zinc-700">
          <div>
            <label htmlFor="users-created-from" className={labelClass}>
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="size-3.5 opacity-70" />
                {t("users.list.created_from")}
              </span>
            </label>
            <input
              id="users-created-from"
              type="date"
              value={createdFrom}
              onChange={(e) => onCreatedFromChange(e.target.value)}
              className={dateInputClass}
            />
          </div>
          <div>
            <label htmlFor="users-created-to" className={labelClass}>
              {t("users.list.created_to")}
            </label>
            <input
              id="users-created-to"
              type="date"
              value={createdTo}
              onChange={(e) => onCreatedToChange(e.target.value)}
              className={dateInputClass}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
