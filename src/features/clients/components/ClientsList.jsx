import { useGetClientsQuery, useAddClientMutation } from "../clientsApiSlice";

export default function ClientsList() {
  // الـ Hook يعطينا كل شيء تحتاجه الواجهة
  const { data: clients, isLoading, isError } = useGetClientsQuery();
  const [addClient] = useAddClientMutation();

  if (isLoading) return <p>جاري تحميل العملاء...</p>;
  if (isError) return <p>حدث خطأ أثناء الاتصال بـ Laravel</p>;

  return (
    <div>
      <h2>قائمة عملاء الـ CRM</h2>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <button onClick={() => addClient({ name: "عميل جديد" })}>
        إضافة عميل
      </button>
    </div>
  );
}
