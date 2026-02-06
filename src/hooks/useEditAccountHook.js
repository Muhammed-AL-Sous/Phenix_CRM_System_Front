import { useUpdateUserMutation } from "../features/users/usersApiSlice";

const EditAccount = ({ userId }) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleUpdate = async (newData) => {
    try {
      await updateUser({ id: userId, ...newData }).unwrap();
      alert("تم التحديث بنجاح");
    } catch (err) {
      // هنا تظهر أخطاء الصلاحية من Laravel (مثلاً لو زبون حاول يعدل لمدير)
      alert(err.data?.message || "فشلت العملية");
    }
  };
  return { handleUpdate, isLoading };
};

export default EditAccount;
