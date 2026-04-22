import { Suspense } from "react";
import { useSelector } from "react-redux";
import { ROLES_CONFIG } from "../../../routes/roles.config";
import { selectCurrentUser } from "../../auth/authSlice";
import { Spinner } from "../../../components/common/SpinnerFallback";

const DashboardPage = () => {
  const user = useSelector(selectCurrentUser);

  const RoleStatsComponent = ROLES_CONFIG[user.role]?.statsComponent;

  if (!RoleStatsComponent) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div
          // className="flex min-h-[10rem] w-full max-w-4xl items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 dark:border-zinc-800/80 dark:bg-zinc-900/40"
          className="flex min-h-40 w-full max-w-4xl items-center justify-center "
          aria-busy
        >
          <Spinner size="lg" />
        </div>
      }
    >
      <RoleStatsComponent />
    </Suspense>
  );
};

export default DashboardPage;
