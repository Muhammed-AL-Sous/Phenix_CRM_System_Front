import { useAddClientMutation, useGetClientsQuery } from "../clientsApiSlice";
import { RouteSuspenseFallback } from "../../../components/common/GlobalLoader";

export default function CRMPage() {
  // بمجرد تحميل الصفحة، يتم جلب البيانات وتخزينها بالكاش بـ Tag "clients"
  const { data: clients, isLoading } = useGetClientsQuery();
  const [addClient] = useAddClientMutation();

  const handleAdd = async () => {
    await addClient({ name: "الشركة الدولية" });
    // بمجرد نجاح الطلب، RTK Query سيعرف أن Tag "clients" أصبح قديماً
    // وسيقوم بإرسال طلب GET /clients في الخلفية فوراً وتحديث القائمة!
  };

  return (
    <div>
      {isLoading ? (
        <RouteSuspenseFallback className="min-h-[50vh]" />
      ) : (
        <ul>
          {clients?.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleAdd}>إضافة شركة جديدة</button>
    </div>
  );
}
