import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import {
  useGetUserDataQuery,
  useLazyGetCsrfTokenQuery,
} from "../../../auth/authApiSlice";
import {
  selectCurrentUser,
  selectAuthReady,
  setCredentials,
  logOut,
  setAuthReady,
} from "../../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const hasFastCheck = useMemo(() => {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("fast_check="));
  }, []);

  const hasXSRFToken = useMemo(() => {
    return document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("XSRF-TOKEN="));
  }, []);

  const [
    getCsrfToken,
    {
      isFetching: isCsrfFetching,
      isSuccess: isCsrfSuccess,
      isError: isCsrfError,
    },
  ] = useLazyGetCsrfTokenQuery();

  const csrfReady = useMemo(() => {
    if (user) return true;
    if (!hasFastCheck) return true;
    if (hasXSRFToken) return true;
    if (isCsrfSuccess || isCsrfError) return true;
    return false;
  }, [user, hasFastCheck, hasXSRFToken, isCsrfSuccess, isCsrfError]);

  useEffect(() => {
    if (user) return;
    if (!hasFastCheck) return;
    if (hasXSRFToken) return;
    if (isCsrfSuccess || isCsrfError) return;

    getCsrfToken()
      .unwrap()
      .then(() => {})
      .catch(() => {});
  }, [
    user,
    hasFastCheck,
    hasXSRFToken,
    isCsrfSuccess,
    isCsrfError,
    getCsrfToken,
  ]);

  const skipUserData = !!user || !csrfReady;
  const { data, error, isLoading, isFetching, isUninitialized } =
    useGetUserDataQuery(undefined, {
      skip: skipUserData,
      retryOnMountWithNoData: false,
      refetchOnFocus: false,
    });

  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data));
    }

    if (error?.status === 401 || error?.status === 419) {
      document.cookie =
        "fast_check=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      dispatch(logOut());
    } else if (error) {
      console.warn("[AuthInitializer] getUserData failed", error);
    }
  }, [data, error, dispatch]);

  const isUserDataLoading =
    !user && !data && !error && (isLoading || isFetching || isUninitialized);

  const isAuthLoading =
    (hasFastCheck && !csrfReady) || isCsrfFetching || isUserDataLoading;

  const authReady = useSelector(selectAuthReady);

  useEffect(() => {
    if (!isAuthLoading && !authReady) {
      dispatch(setAuthReady(true));
    }
  }, [isAuthLoading, authReady, dispatch]);

  if (isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return children;
}
