import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError(); // هذه الأداة تخبرك بنوع الخطأ بالتفصيل
  console.error(error);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>عذراً! حدث خطأ ما</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      {error.status === 404 ? (
        <p>هذه الصفحة غير موجودة.</p>
      ) : (
        <p>فشلنا في تحميل البيانات من الخادم.</p>
      )}
      <Link to="/">العودة للرئيسية</Link>
    </div>
  );
}