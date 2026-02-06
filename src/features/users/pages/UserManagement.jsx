import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../auth/authSlice";
import { useGetUsersQuery, useDeleteUserMutation } from "../usersApiSlice";

export default function UserManagement() {
  const user = useSelector(selectCurrentUser);
  const { data: users, isLoading } = useGetUsersQuery(undefined, {
    skip: user.role !== "admin", // تخطي الطلب إذا لم يكن مديراً
  });
  const [deleteUser] = useDeleteUserMutation();

  if (user.role !== "admin") {
    return <p>ليس لديك صلاحية للدخول هنا.</p>;
  }

  return (
    <div>
      <h2>إدارة المستخدمين</h2>
      {users?.map((u) => (
        <div key={u.id}>
          {u.name} - {u.role}
          <button onClick={() => deleteUser(u.id)}>حذف</button>
        </div>
      ))}
    </div>
  );
}
