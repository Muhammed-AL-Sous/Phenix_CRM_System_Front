import { useState } from "react";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
} from "../../customer/customersApiSlice";

export default function CustomersTable() {
  const [search, setSearch] = useState("");

  // 1. جلب البيانات (تتحدث تلقائياً عند تغيير نص البحث)
  const {
    data: customers,
    isLoading,
    isFetching,
  } = useGetCustomersQuery(search);

  // 2. دالة الحذف
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      try {
        await deleteCustomer(id).unwrap();
        // لا حاجة لعمل أي شيء هنا، الجدول سيحدث نفسه بفضل الـ Tags!
      } catch (err) {
        alert("فشل الحذف: " + err.data?.message);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">إدارة العملاء</h2>
        {/* حقل البحث */}
        <input
          type="text"
          placeholder="ابحث عن عميل..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>جاري تحميل البيانات لأول مرة...</p>
      ) : (
        <table
          className={`w-full border-collapse ${isFetching ? "opacity-50" : ""}`}
        >
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-right">الاسم</th>
              <th className="border p-2 text-right">البريد</th>
              <th className="border p-2 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="border p-2">{customer.name}</td>
                <td className="border p-2">{customer.email}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    disabled={isDeleting}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isFetching && <p className="text-sm text-blue-500">جاري التحديث...</p>}
    </div>
  );
}
