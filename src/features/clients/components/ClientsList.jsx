import { useGetClientsQuery, useAddClientMutation } from "../clientsApiSlice";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

export default function ClientsList() {
  // الـ Hook يعطينا كل شيء تحتاجه الواجهة
  const { data: clients, isLoading, isError } = useGetClientsQuery();
  const [addClient] = useAddClientMutation();

  if (isLoading) return <RouteSuspenseFallback className="min-h-[50vh]" />;
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
