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
import { sonnerToast } from "../../../lib/notifySonner";
import { Spinner } from "../../../components/common/GlobalLoader";
import FormListbox from "../../../components/utility/FormListbox";
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
  const [logoFile, setLogoFile] = useState(null);

  const { data: lookup, isLoading: lookupLoading } = useGetClientCreationDataQuery(
    { lang: lang || "ar" },
  );

  const countryId =
    form.country_id !== "" &&
    form.country_id != null &&
    !Number.isNaN(Number(form.country_id))
      ? Number(form.country_id)
      : null;

  const {
    data: cities = [],
    isFetching: citiesFetching,
    isError: citiesError,
  } = useGetCitiesForCountryQuery(
    { countryId, lang: lang || "ar" },
    { skip: !countryId, refetchOnMountOrArgChange: true },
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
    if (citiesFetching) {
      return t("placeholders.loading_cities");
    }
    if (citiesError) {
      return t("placeholders.select_city");
    }
    if (Array.isArray(cities) && cities.length === 0) {
      return t("placeholders.no_cities");
    }
    return t("placeholders.select_city");
  }, [countryId, citiesFetching, citiesError, cities, t]);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      country_id: value,
      subdivision_id: "",
    }));
  };

  const handleCityChange = (value) => {
    setForm((prev) => ({ ...prev, subdivision_id: value }));
  };

  const handleBusinessActivityChange = (value) => {
    setForm((prev) => ({ ...prev, business_activity_id: value }));
  };

  const handleJobTitleChange = (value) => {
    setForm((prev) => ({ ...prev, job_title_id: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    const payload = new FormData();
    payload.append("company_name", form.company_name.trim());
    payload.append("client_name", form.client_name.trim());
    payload.append("phone", form.phone.trim());
    payload.append("address", form.address.trim());
    payload.append("country_id", String(Number(form.country_id)));
    payload.append("subdivision_id", String(Number(form.subdivision_id)));
    payload.append(
      "business_activity_id",
      String(Number(form.business_activity_id)),
    );
    payload.append("job_title_id", String(Number(form.job_title_id)));

    if (logoFile) {
      payload.append("company_logo", logoFile);
    }

    try {
      const res = await addClient(payload).unwrap();
      const updatedUser = res?.data?.user;
      if (updatedUser) {
        dispatch(setCredentials({ user: updatedUser }));
      }
      sonnerToast.success(t("success.saved"));
      navigate("/client", { replace: true });
    } catch (err) {
      const serverMsg = err?.data?.message;
      sonnerToast.error(serverMsg || t("errors.save_failed"));
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
            <FormListbox
              value={form.country_id}
              onChange={handleCountryChange}
              options={countries}
              placeholder={t("placeholders.select_country")}
              filterPlaceholder={t("placeholders.filter_list")}
              filterEmptyLabel={t("placeholders.no_search_results")}
              emptyLabel={t("placeholders.select_country")}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.city")}
            </label>
            <FormListbox
              value={form.subdivision_id}
              onChange={handleCityChange}
              options={cities}
              placeholder={cityPlaceholder}
              disabled={!countryId || citiesFetching}
              loading={Boolean(countryId && citiesFetching)}
              emptyLabel={t("placeholders.no_cities")}
              filterPlaceholder={t("placeholders.filter_list")}
              filterEmptyLabel={t("placeholders.no_search_results")}
            />
            {citiesError && countryId ? (
              <p
                className="mt-2 text-sm text-red-600 dark:text-red-400"
                style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
              >
                {t("errors.cities_load_failed")}
              </p>
            ) : null}
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
            <FormListbox
              value={form.business_activity_id}
              onChange={handleBusinessActivityChange}
              options={businessActivities}
              placeholder={t("placeholders.select")}
              emptyLabel={t("placeholders.select")}
              filterPlaceholder={t("placeholders.filter_list")}
              filterEmptyLabel={t("placeholders.no_search_results")}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
            >
              {t("fields.job_title")}
            </label>
            <FormListbox
              value={form.job_title_id}
              onChange={handleJobTitleChange}
              options={jobTitles}
              placeholder={t("placeholders.select")}
              emptyLabel={t("placeholders.select")}
              filterPlaceholder={t("placeholders.filter_list")}
              filterEmptyLabel={t("placeholders.no_search_results")}
            />
          </div>
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
          >
            {t("fields.company_logo")}
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              if (!f) {
                setLogoFile(null);
                return;
              }
              // 512 KB server limit; keep a small client guard too
              if (f.size > 512 * 1024) {
                sonnerToast.error(t("errors.logo_too_large"));
                e.target.value = "";
                setLogoFile(null);
                return;
              }
              setLogoFile(f);
            }}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:me-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-white file:font-semibold hover:file:bg-red-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Max size: 512KB. PNG/JPG/WebP.
          </p>
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
