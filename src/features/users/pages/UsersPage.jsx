// React and Redux
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

// Slices
import { useGetUsersQuery, useDeleteUserMutation } from "../usersApiSlice";
import { selectCurrentUser } from "../../auth/authSlice";

// Global Components
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

// Icons
import { UserCog, UserPlus } from "lucide-react";

// Utilities Components
import UsersTable from "../components/UsersTable";
import UsersModal from "../components/UsersModal";

// External Libraries
import { notify } from "../../../lib/notify";
import { useTranslation } from "react-i18next";

const ADMIN_ONLY = new Set(["admin"]);

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const canFetchUsers = useMemo(
    () => ADMIN_ONLY.has(currentUser?.role),
    [currentUser?.role],
  );
  const { direction } = useSelector((state) => state.ui);
  const { t } = useTranslation("user");

  // ======== Users Query ======== //
  const {
    data: users = [],
    isLoading,
    refetch,
    error,
  } = useGetUsersQuery({ scope: currentUser?.role }, { skip: !canFetchUsers });
  const [deleteUser] = useDeleteUserMutation();
  console.log(users);

  // ======== Delete user handler Function ======== //
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId).unwrap();
      notify("auth:success.user_deleted", "success");
      refetch();
    } catch (_error) {
      notify("auth:error.delete_failed", "error");
    }
  };

  // ======== Edit user handler Function ======== //
  const handleEditUser = async (userId) => {
    // Implement edit functionality here
    console.log("Edit user with ID:", userId);
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
    <div className="users-page">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-semibold text-slate-700 dark:text-gray-200"
          style={{ fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter" }}
        >
          {t("users.manage_users")}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-2
          dark:bg-gray-900 dark:text-gray-200 text-gray-800 bg-slate-300
            py-2 rounded-xl text-xs font-semibold cursor-pointer
            hover:bg-slate-400 transition-colors duration-200 hover:dark:bg-gray-800"
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

      <UsersTable
        users={users}
        onDelete={handleDeleteUser}
        onEdit={handleEditUser}
      />

      <UsersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default UsersPage;
