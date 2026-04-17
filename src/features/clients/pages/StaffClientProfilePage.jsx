import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { selectCurrentUser } from "../../auth/authSlice";
import { useGetAdminClientQuery } from "../clientsApiSlice";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

const STAFF = new Set(["admin", "manager", "support"]);

export default function StaffClientProfilePage() {
  const { clientId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation("clientProfile");
  const dir = direction === "rtl" ? "rtl" : "ltr";

  const canView = useMemo(
    () => STAFF.has(currentUser?.role),
    [currentUser?.role],
  );

  const listPath = useMemo(() => {
    const role = currentUser?.role;
    if (!role) return "/";
    return `/${role}/clients`;
  }, [currentUser?.role]);

  const {
    data: client,
    isLoading,
    isFetching,
    error,
  } = useGetAdminClientQuery(clientId, {
    skip: !canView || !clientId,
  });

  if (!canView) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
    );
  }

  if (isLoading) return <RouteSuspenseFallback className="min-h-[50vh]" />;

  if (error || !client) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 p-6 text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
        <p className="font-medium">{t("staffClient.not_found")}</p>
        <Link
          to={listPath}
          className="mt-3 inline-block text-sm font-semibold text-sky-700 underline dark:text-sky-300"
        >
          {t("staffClient.open_list")}
        </Link>
      </div>
    );
  }

  const u = client.user;

  return (
    <div
      key={clientId}
      dir={dir}
      className={`space-y-6 ${isFetching ? "opacity-70 transition-opacity" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-semibold text-slate-800 dark:text-slate-100"
            style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
          >
            {t("staffClient.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            #{client.id} — {client.company_name || "—"}
          </p>
        </div>
        <Link
          to={listPath}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-200 dark:hover:bg-zinc-800"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          <ArrowRight
            className={`size-4 shrink-0 ${direction === "rtl" ? "rotate-180" : ""}`}
            aria-hidden
          />
          {t("staffClient.back")}
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <h2
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          {t("staffClient.account")}
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.contact_name")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {u?.name || client.client_name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.company_name")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.company_name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("staffClient.label_email")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {u?.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("staffClient.label_role")}
            </dt>
            <dd className="font-medium capitalize text-slate-900 dark:text-slate-100">
              {u?.role || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("staffClient.label_active")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {u?.is_active ? t("staffClient.active_yes") : t("staffClient.active_no")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <h2
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          {t("staffClient.profile")}
        </h2>
        {client.company_logo_url ? (
          <img
            src={client.company_logo_url}
            alt=""
            className="mb-4 h-16 w-auto max-w-[200px] rounded-lg object-contain"
          />
        ) : null}
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.phone")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.phone || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.address")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.address || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.country")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.country?.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.city")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.subdivision?.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.business_activity")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.business_activity?.name || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("fields.job_title")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {client.job_title?.name || "—"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
