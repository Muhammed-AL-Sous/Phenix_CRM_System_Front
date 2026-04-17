// React and Redux
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// Slices
import { useGetUsersQuery, useDeleteUserMutation } from "../usersApiSlice";
import { selectCurrentUser } from "../../auth/authSlice";

// Global Components
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

// Icons
import { UserPlus } from "lucide-react";

// Utilities Components
import UsersTable from "../components/UsersTable";
import UsersModal from "../components/UsersModal";
import UsersListToolbar from "../components/UsersListToolbar";
import UsersPagination from "../components/UsersPagination";

// Hooks
import { useDebouncedValue } from "../hooks/useDebouncedValue";

// External Libraries
import { notify } from "../../../lib/notify";
import { useTranslation } from "react-i18next";

const ADMIN_ONLY = new Set(["admin"]);

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const currentUser = useSelector(selectCurrentUser);
  const canFetchUsers = useMemo(
    () => ADMIN_ONLY.has(currentUser?.role),
    [currentUser?.role],
  );
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation("user");
  const dir = direction === "rtl" ? "rtl" : "ltr";

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [sort, setSort] = useState("-id");
  const [searchInput, setSearchInput] = useState("");
  const resetPage = useCallback(() => setPage(1), []);
  const debouncedSearch = useDebouncedValue(searchInput, 400, resetPage);
  const [role, setRole] = useState("");
  const [activeFilter, setActiveFilter] = useState(
    /** @type {'' | 'active' | 'inactive'} */ (""),
  );
  const [verifiedFilter, setVerifiedFilter] = useState(
    /** @type {'' | 'yes' | 'no'} */ (""),
  );
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const queryArg = useMemo(() => {
    const arg = {
      scope: currentUser?.role,
      page,
      per_page: perPage,
      sort,
    };
    const q = debouncedSearch.trim();
    if (q) arg.search = q;
    if (role) arg.role = role;
    if (activeFilter === "active") arg.is_active = true;
    if (activeFilter === "inactive") arg.is_active = false;
    if (verifiedFilter === "yes") arg.email_verified = true;
    if (verifiedFilter === "no") arg.email_verified = false;
    if (createdFrom) arg.created_from = createdFrom;
    if (createdTo) arg.created_to = createdTo;
    return arg;
  }, [
    currentUser?.role,
    page,
    perPage,
    sort,
    debouncedSearch,
    role,
    activeFilter,
    verifiedFilter,
    createdFrom,
    createdTo,
  ]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetUsersQuery(queryArg, { skip: !canFetchUsers });

  const users = data?.users ?? [];
  const meta = data?.meta;

  const [deleteUser] = useDeleteUserMutation();

  const handleResetFilters = () => {
    setSearchInput("");
    setSort("-id");
    setRole("");
    setActiveFilter("");
    setVerifiedFilter("");
    setCreatedFrom("");
    setCreatedTo("");
    setPerPage(15);
    setPage(1);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t("users.confirmDelete"))) return;

    try {
      await deleteUser(userId).unwrap();
      notify("user:users.toast_deleted", "success");
      refetch();
    } catch (_error) {
      notify("user:users.toast_delete_failed", "error");
    }
  };

  const handleEditUser = (userId) => {
    setModalKey((k) => k + 1);
    setModalUserId(userId);
    setIsModalOpen(true);
  };

  if (!canFetchUsers) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You do not have permission to view this page.
      </p>
    );
  }

  if (isLoading) return <RouteSuspenseFallback className="min-h-[50vh]" />;

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed to load users."}
      </p>
    );
  }

  return (
    <div className="users-page" dir={dir}>
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-2xl font-semibold text-slate-700 dark:text-gray-200"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          {t("users.manage_users")}
        </h1>
        <button
          type="button"
          onClick={() => {
            setModalKey((k) => k + 1);
            setModalUserId(null);
            setIsModalOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors duration-200 hover:bg-slate-300 dark:bg-gray-900 dark:text-gray-200 hover:dark:bg-gray-800"
        >
          <UserPlus size={16} />
          <span
            style={{
              fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
              position: "relative",
              top: direction === "rtl" ? 0 : 1,
            }}
          >
            {t("users.add_user")}
          </span>
        </button>
      </div>

      <UsersListToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        sort={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        role={role}
        onRoleChange={(v) => {
          setRole(v);
          setPage(1);
        }}
        activeFilter={activeFilter}
        onActiveFilterChange={(v) => {
          setActiveFilter(v);
          setPage(1);
        }}
        verifiedFilter={verifiedFilter}
        onVerifiedFilterChange={(v) => {
          setVerifiedFilter(v);
          setPage(1);
        }}
        createdFrom={createdFrom}
        createdTo={createdTo}
        onCreatedFromChange={(v) => {
          setCreatedFrom(v);
          setPage(1);
        }}
        onCreatedToChange={(v) => {
          setCreatedTo(v);
          setPage(1);
        }}
        perPage={perPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
        onReset={handleResetFilters}
        dir={dir}
      />

      <UsersTable
        users={users}
        page={page}
        perPage={perPage}
        metaFrom={meta?.from}
        emptyLabel={t("users.list.no_results")}
        isFetching={isFetching && !isLoading}
        onDelete={handleDeleteUser}
        onEdit={handleEditUser}
      />

      <UsersPagination
        meta={meta}
        onPageChange={setPage}
        disabled={isFetching}
        dir={dir}
      />

      <UsersModal
        isOpen={isModalOpen}
        userId={modalUserId}
        modalKey={modalKey}
        onClose={() => {
          setIsModalOpen(false);
          setModalUserId(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setModalUserId(null);
          refetch();
        }}
      />
    </div>
  );
};

export default UsersPage;
