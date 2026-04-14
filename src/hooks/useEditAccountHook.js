import { useUpdateUserMutation } from "../features/users/usersApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

const EditAccount = ({ userId }) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const currentUser = useSelector(selectCurrentUser);

  const handleUpdate = async (newData) => {
    try {
      await updateUser({
        id: userId,
        scope: currentUser?.role,
        ...newData,
      }).unwrap();
      alert("تم التحديث بنجاح");
    } catch (err) {
      // هنا تظهر أخطاء الصلاحية من Laravel (مثلاً لو زبون حاول يعدل لمدير)
      alert(err.data?.message || "فشلت العملية");
    }
  };
  return { handleUpdate, isLoading };
};

export default EditAccount;
