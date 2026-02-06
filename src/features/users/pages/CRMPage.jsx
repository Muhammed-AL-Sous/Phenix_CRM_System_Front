import {
  useAddCustomerMutation,
  useGetCustomersQuery,
} from "../../customer/customersApiSlice";

export default function CRMPage() {
  // بمجرد تحميل الصفحة، يتم جلب البيانات وتخزينها بالكاش بـ Tag "Customers"
  const { data: customers, isLoading } = useGetCustomersQuery();
  const [addCustomer] = useAddCustomerMutation();

  const handleAdd = async () => {
    await addCustomer({ name: "الشركة الدولية" });
    // بمجرد نجاح الطلب، RTK Query سيعرف أن Tag "Customers" أصبح قديماً
    // وسيقوم بإرسال طلب GET /customers في الخلفية فوراً وتحديث القائمة!
  };

  return (
    <div>
      {isLoading ? (
        <p>جاري التحديث...</p>
      ) : (
        <ul>
          {customers?.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleAdd}>إضافة شركة جديدة</button>
    </div>
  );
}
