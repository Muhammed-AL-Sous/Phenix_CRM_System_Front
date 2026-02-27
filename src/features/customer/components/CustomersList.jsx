import {
  useGetCustomersQuery,
  useAddCustomerMutation,
} from "../customersApiSlice";

export default function CustomersList() {
  // الـ Hook يعطينا كل شيء تحتاجه الواجهة
  const { data: customers, isLoading, isError } = useGetCustomersQuery();
  const [addCustomer] = useAddCustomerMutation();

  if (isLoading) return <p>جاري تحميل العملاء...</p>;
  if (isError) return <p>حدث خطأ أثناء الاتصال بـ Laravel</p>;

  return (
    <div>
      <h2>قائمة عملاء الـ CRM</h2>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <button onClick={() => addCustomer({ name: "عميل جديد" })}>
        إضافة عميل
      </button>
    </div>
  );
}
