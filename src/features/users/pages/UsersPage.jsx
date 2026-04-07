import { useState } from "react";
import { useGetUsersQuery, useDeleteUserMutation } from "../usersApiSlice";
import { notify } from "../../../lib/notify";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";
import UsersTable from "../components/UsersTable";
import UsersModal from "../components/UsersModal";

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId).unwrap();
      notify("auth:success.user_deleted", "success");
      refetch();
    } catch (_error) {
      notify("auth:error.delete_failed", "error");
    }
  };

  if (isLoading) return <RouteSuspenseFallback className="min-h-[50vh]" />;

  return (
    <div className="users-page">
      <div className="flex justify-between items-center mb-6">
        <h1>Users Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add User
        </button>
      </div>

      <UsersTable users={users} onDelete={handleDelete} />

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
