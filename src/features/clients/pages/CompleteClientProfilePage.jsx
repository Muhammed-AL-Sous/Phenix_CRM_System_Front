import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  useGetClientCreationDataQuery,
  useGetCitiesForCountryQuery,
  useAddClientMutation,
} from "../clientsApiSlice";
import { selectCurrentUser, setCredentials } from "../../auth/authSlice";
import toast from "react-hot-toast";
import { Spinner } from "../../../components/common/GlobalLoader";
import { Building2, MapPin, Phone, User } from "lucide-react";

const initialForm = {
  company_name: "",
  client_name: "",
  phone: "",
  address: "",
  country_id: "",
  subdivision_id: "",
  business_activity_id: "",
  job_title_id: "",
};

export default function CompleteClientProfilePage() {
  const { t } = useTranslation("clientProfile", { useSuspense: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { direction, lang } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  const [form, setForm] = useState(initialForm);

  const { data: lookup, isLoading: lookupLoading } = useGetClientCreationDataQuery(
    { lang: lang || "ar" },
  );

  const countryId = form.country_id ? Number(form.country_id) : null;

  const { data: cities = [], isFetching: citiesLoading } = useGetCitiesForCountryQuery(
    { countryId, lang: lang || "ar" },
    { skip: !countryId },
  );

  const [addClient, { isLoading: submitting }] = useAddClientMutation();

  useEffect(() => {
    if (user && user.role === "client" && user.requires_client_profile === false) {
      navigate("/client", { replace: true });
    }
  }, [user, navigate]);

  const countries = lookup?.countries ?? [];
  const jobTitles = lookup?.job_titles ?? [];
  const businessActivities = lookup?.business_activities ?? [];

  const cityPlaceholder = useMemo(() => {
    if (!countryId) {
      return t("placeholders.select_country_first");
    }
    if (citiesLoading) {
      return t("placeholders.loading_cities");
    }
    return t("placeholders.select_city");
  }, [countryId, citiesLoading, t]);

  const formValid = useMemo(() => {
    return (
      form.company_name.trim() &&
      form.client_name.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.country_id &&
      form.subdivision_id &&
      form.business_activity_id &&
      form.job_title_id
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "country_id") {
        next.subdivision_id = "";
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    const payload = {
      company_name: form.company_name.trim(),
      client_name: form.client_name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      country_id: Number(form.country_id),
      subdivision_id: Number(form.subdivision_id),
      business_activity_id: Number(form.business_activity_id),
      job_title_id: Number(form.job_title_id),
    };

    try {
      const res = await addClient(payload).unwrap();
      const updatedUser = res?.data?.user;
      if (updatedUser) {
        dispatch(setCredentials({ user: updatedUser }));
      }
      toast.success(t("success.saved"));
      navigate("/client", { replace: true });
    } catch (err) {
      const serverMsg = err?.data?.message;
      toast.error(serverMsg || t("errors.save_failed"));
    }
  };

  if (lookupLoading && !lookup) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-bold text-slate-900 dark:text-white"
          style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
        >
          {t("title")}
        </h1>
        <p
          className="mt-2 text-sm text-slate-600 dark:text-slate-400"
          style={{ fontFamily: isRtl ? "Almarai" : "Inter" }}
        >
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              <Building2 className="h-4 w-4" />
              {t("fields.company_name")}
            </label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              <User className="h-4 w-4" />
              {t("fields.contact_name")}
            </label>
            <input
              name="client_name"
              value={form.client_name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
          >
            <Phone className="h-4 w-4" />
            {t("fields.phone")}
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            dir="ltr"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div>
          <label
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
          >
            <MapPin className="h-4 w-4" />
            {t("fields.address")}
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.country")}
            </label>
            <select
              name="country_id"
              value={form.country_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">{t("placeholders.select_country")}</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.city")}
            </label>
            <select
              name="subdivision_id"
              value={form.subdivision_id}
              onChange={handleChange}
              disabled={!countryId || citiesLoading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">{cityPlaceholder}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.business_activity")}
            </label>
            <select
              name="business_activity_id"
              value={form.business_activity_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">{t("placeholders.select")}</option>
              {businessActivities.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.job_title")}
            </label>
            <select
              name="job_title_id"
              value={form.job_title_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">{t("placeholders.select")}</option>
              {jobTitles.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!formValid || submitting}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
        >
          {submitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner size="sm" variant="onPrimary" />
              {t("actions.saving")}
            </span>
          ) : (
            t("actions.save_and_continue")
          )}
        </button>
      </form>
    </div>
  );
}
