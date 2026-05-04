// React and Redux
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// Slices
import { useGetUsersQuery, useDeleteUserMutation } from "../usersApiSlice";
import { selectCurrentUser } from "../../auth/authSlice";

// Icons
import { UserRoundPlus, ArrowDownWideNarrow } from "lucide-react";

// Components
import UsersTable from "../components/UsersTable";
import UsersModal from "../components/UsersModal";
import DeleteUserConfirmModal from "../components/DeleteUserConfirmModal";
import UsersListToolbar from "../components/UsersListToolbar";
import UsersPagination from "../components/UsersPagination";

// Hooks
import { useDebouncedValue } from "../hooks/useDebouncedValue";

// External Libraries
import { notifySonner } from "../../../lib/notifySonner";
import { useTranslation } from "react-i18next";

// Motion Library
import { motion, AnimatePresence } from "motion/react";

/** Admin: all roles. Other staff: client accounts only (matches API). */
const STAFF_USER_MANAGEMENT = new Set(["admin", "manager", "support", "sales"]);

const UsersPage = () => {
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-id");
  const [perPage, setPerPage] = useState(15);
  const [modalKey, setModalKey] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenGroup, setIsOpenGroup] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState(null);

  const currentUser = useSelector(selectCurrentUser);
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation("user");
  const dir = direction === "rtl" ? "rtl" : "ltr";
  const resetPage = useCallback(() => setPage(1), []);
  const debouncedSearch = useDebouncedValue(searchInput, 400, resetPage);
  const isAdmin = currentUser?.role === "admin";
  const clientsOnlyMode = Boolean(currentUser?.role) && !isAdmin;

  const canFetchUsers = useMemo(
    () => STAFF_USER_MANAGEMENT.has(currentUser?.role),
    [currentUser?.role],
  );

  const queryArg = useMemo(() => {
    const arg = {
      scope: currentUser?.role,
      page,
      per_page: perPage,
      sort,
    };
    const q = debouncedSearch.trim();
    if (q) arg.search = q;
    if (!clientsOnlyMode && role) arg.role = role;
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
    clientsOnlyMode,
    role,
    activeFilter,
    verifiedFilter,
    createdFrom,
    createdTo,
  ]);

  // ===== Get Users Query With `Skip` When User Doesn't Have Permission To View Users ===== //
  const { data, isLoading, isFetching, refetch, error } = useGetUsersQuery(
    queryArg,
    { skip: !canFetchUsers },
  );

  const users = useMemo(() => data?.users ?? [], [data?.users]);

  const meta = data?.meta;

  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  useEffect(() => {
  // نتحقق من وجود رقم الصفحة لتجنب التنفيذ عند أول تحميل إذا لم تكن هناك بيانات بعد
  if (meta?.current_page) {
    // نبحث عن حاوية التمرير الأساسية في الـ Dashboard
    const scrollContainer = document.querySelector("main.no-scroll-anchor");
    
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
}, [meta?.current_page]);

  const deleteConfirmLabel = useMemo(() => {
    if (deleteConfirmUserId == null) return "";
    const u = users.find((row) => row.id === deleteConfirmUserId);
    if (!u) return "";
    const bits = [u.name, u.email].filter(Boolean);
    return bits.join(" — ");
  }, [deleteConfirmUserId, users]);

  // ===== Reset Filters To Default Values ===== //
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

  // ==== Request To Delete User (Open Confirmation Modal) ===== //
  const handleRequestDeleteUser = (userId) => {
    setDeleteConfirmUserId(userId);
  };

  // ===== Confirm Deletion Of User ===== //
  const handleConfirmDeleteUser = async () => {
    if (deleteConfirmUserId == null) return;
    try {
      await deleteUser({
        id: deleteConfirmUserId,
        scope: currentUser?.role,
      }).unwrap();
      notifySonner("user:users.toast_deleted", "success");
      setDeleteConfirmUserId(null);
      refetch();
    } catch (_error) {
      notifySonner("user:users.toast_delete_failed", "error");
    }
  };

  // ==== Handle Edit User (Open Modal With User Data) ===== //
  const handleEditUser = (userId) => {
    setModalKey((k) => k + 1);
    setModalUserId(userId);
    setIsModalOpen(true);
  };

  if (!canFetchUsers) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        You Do Not Have Permission To View This Page.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 dark:text-red-400">
        {error?.data?.message || "Failed To Load Users."}
      </p>
    );
  }

  return (
    <div className="users-page" dir={dir}>
      <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-4">
        <h1
          className="text-2xl font-semibold text-slate-700 dark:text-gray-200"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          {t(
            clientsOnlyMode
              ? "users.manage_client_users"
              : "users.manage_users",
          )}
        </h1>

        <div className="flex gap-2 items-center">
          {/* ===== Add User Button ===== */}
          <button
            type="button"
            onClick={() => {
              setModalKey((k) => k + 1);
              setModalUserId(null);
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-slate-900 dark:bg-gray-900 dark:text-gray-200 hover:dark:bg-gray-800"
          >
            <UserRoundPlus size={17} />
            <span
              style={{
                fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
              }}
            >
              {t("users.add_user")}
            </span>
          </button>

          {/* ===== Filter Button ===== */}
          <button
            onClick={() => setIsOpenGroup((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-red-600 dark:bg-red-800 dark:text-gray-200 hover:dark:bg-red-900"
          >
            <ArrowDownWideNarrow size={17} />
            {t("users.list.filter")}
          </button>
        </div>
      </div>

      {/* ===== Users List Toolbar ===== */}
      <AnimatePresence initial={false}>
        {isOpenGroup && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <UsersListToolbar
              searchInput={searchInput}
              onSearchChange={setSearchInput}
              sort={sort}
              onSortChange={(v) => {
                setSort(v);
                setPage(1);
              }}
              hideRoleFilter={clientsOnlyMode}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Users Table ===== */}
      <UsersTable
        users={users}
        page={page}
        perPage={perPage}
        metaFrom={meta?.from}
        emptyLabel={t("users.list.no_results")}
        isInitialLoading={isLoading}
        isFetching={isFetching && !isLoading}
        canDelete={isAdmin}
        onDelete={handleRequestDeleteUser}
        onEdit={handleEditUser}
      />

      {/* ===== Users Pagination ===== */}
      <UsersPagination
        meta={meta}
        onPageChange={setPage}
        disabled={isFetching}
        dir={dir}
      />

      {/* ===== Edit & Add Users Modal ===== */}
      <UsersModal
        isOpen={isModalOpen}
        userId={modalUserId}
        modalKey={modalKey}
        clientsOnly={clientsOnlyMode}
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

      {/* ===== Delete User Confirm Modal ===== */}
      <DeleteUserConfirmModal
        isOpen={deleteConfirmUserId != null}
        userLabel={deleteConfirmLabel}
        isDeleting={isDeletingUser}
        onClose={() => {
          if (!isDeletingUser) setDeleteConfirmUserId(null);
        }}
        onConfirm={handleConfirmDeleteUser}
      />
    </div>
  );
};

export default UsersPage;
