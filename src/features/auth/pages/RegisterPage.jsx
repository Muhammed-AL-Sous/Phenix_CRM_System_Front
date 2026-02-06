import { useState } from 'react';
import { useRegisterMutation } from '../../auth/authApiSlice';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // دالة الـ Register تعطينا الـ error ككائن جاهز
  const [register, { error, isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap(); // unwrap تجعلنا نمسك الخطأ في catch
      alert("تم التسجيل بنجاح!");
    } catch (err) {
      // الأخطاء مخزنة الآن في المتغير 'error' بالأعلى تلقائياً
      console.error("فشل التسجيل", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
      />
      {/* عرض خطأ الإيميل من Laravel */}
      {error?.status === 422 && (
        <p className="text-red-500">{error.data.errors.email?.[0]}</p>
      )}

      <input 
        type="password" 
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
      />
      {/* عرض خطأ الباسورد من Laravel */}
      {error?.status === 422 && (
        <p className="text-red-500">{error.data.errors.password?.[0]}</p>
      )}

      <button disabled={isLoading}>تسجيل</button>
    </form>
  );
}