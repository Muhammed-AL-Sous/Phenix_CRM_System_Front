// ========= React Hooks ========= //
import { useState } from "react";

// ========= Translation Hook ========= //
import { useTranslation } from "react-i18next";

// ========= React Redux ========= //
import { useSelector } from "react-redux";

// Icons
import { BadgeCheck, Mail } from "lucide-react";

// ========= Notification Toast ========= //
import { notify } from "../../../lib/notify.js";

// ========= Forgot Password Slice ========= //
import {
  useLazyGetCsrfTokenQuery,
  useForgotPasswordMutation,
} from "../authApiSlice.js";

// ========= React Router ========= //
import { Link, useNavigate, useLocation } from "react-router";

const ForgotPasswordPage = () => {
  // ========= States ========= //
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [isSent, setIsSent] = useState(false);

  // ========= API Mutation ========= //
  const [getCsrfToken, { isLoading: isCsrfLoading }] =
    useLazyGetCsrfTokenQuery();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  // ========= Translation ========= //
  const { t } = useTranslation(["auth"]);

  const { direction } = useSelector((state) => state.ui);
  const navigate = useNavigate();

  // ========= Validate Forgot Password Form ========= //
  const validateForogtPassForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setErrors("error.email_required");
    } else if (!emailRegex.test(email)) {
      setErrors("error.email_invalid");
    }
    return email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق المحلي أولاً
    const isValid = validateForogtPassForm();
    if (!isValid) return; // توقف هنا ولا ترسل للسيرفر

    try {
      await getCsrfToken().unwrap();

      const forgotPasswordPromise = forgotPassword(email.trim()).unwrap();

      await forgotPasswordPromise;

      notify("auth:success.reset_link_sent", "success");
      setIsSent(true);
    } catch (err) {
      // معالجة الأخطاء المخصصة فقط
      if (err.status === 404) {
        notify(t("auth:error.email_not_found"), "error");
      } else if (err.status === 422) {
        notify(t("auth:error.validation_error"), "error");
      } else {
        notify(t("auth:error.server_error"), "error");
      }
    }
  };

  // if (isSent) {
  //   return (

  //   );
  // }

  return (
    <div className="">
      <div className="flex items-center gap-2 justify-center">
      <h2 className="text-2xl font-bold text-green-600">تفقد بريدك الإلكتروني</h2>
      <BadgeCheck className="" style={{color:"#00a63e"}} />
      </div>

      <p className="text-gray-600 my-4">
        لقد أرسلنا رابطاً خاصاً إلى <strong>{email}</strong> لاستعادة الوصول
        لحسابك.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="text-blue-600 hover:underline"
      >
        العودة لتسجيل الدخول
      </button>
    </div>
  );
};

export default ForgotPasswordPage;

// <form onSubmit={handleSubmit}>
//   {/* ============= Email ============= */}
//   <div className="relative mb-7">
//     {/* ======= Label Email ======= */}
//     <label
//       style={{
//         fontFamily: direction === "rtl" ? "Vazirmatn" : "Inter",
//       }}
//       className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
//     >
//       <span>
//         <Mail
//           style={{
//             top: direction === "rtl" ? "-2px" : "",
//           }}
//           className="w-4 h-4 relative"
//         />
//       </span>
//       {t("email.email")}
//     </label>
//     <div className="relative">
//       {/* ======= Input Email ======= */}
//       <input
//         type="email"
//         name="email"
//         value={email}
//         onChange={(e) => {
//           setErrors("");
//           setEmail(e.target.value);
//         }}
//         autoComplete="email"
//         className={`w-full px-4 py-3 rounded-xl text-slate-800 bg-slate-50 dark:bg-zinc-800 border outline-none transition-all dark:text-white focus:ring-2
//     ${errors ? "border-red-500 ring-red-500/20" : "border-slate-200 dark:border-zinc-700 focus:ring-red-500/20"}`}
//         placeholder="name@company.com"
//         style={{
//           fontFamily: "Livvic",
//           fontWeight: "500",
//         }}
//       />

//       {/* ======= Errors Email ======= */}
//       {errors && (
//         <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
//           <p
//             className="text-red-500 text-xs font-semibold px-1"
//             style={{
//               fontFamily: direction === "rtl" ? "Almarai" : "Livvic",
//             }}
//           >
//             {t(errors)}
//           </p>
//         </div>
//       )}
//     </div>
//   </div>

//   {/* ============= Continue Button ============= */}

//   <button
//     type="submit"
//     disabled={isLoading || isCsrfLoading}
//     style={{
//       fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
//     }}
//     className={`w-full py-3 bg-red-500
//     hover:bg-red-600 duration-300 text-white font-bold
//     rounded-3xl shadow-lg shadow-red-500/30 transition-all transform
//      active:scale-[0.98] cursor-pointer
//        ${
//          isLoading || isCsrfLoading
//            ? "bg-red-500 cursor-not-allowed opacity-80"
//            : "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 cursor-pointer"
//        }`}
//   >
//     {isLoading || isCsrfLoading ? (
//       <span className="flex items-center justify-center">
//         <span className="w-6 h-6 block border-3 border-white border-t-transparent rounded-full animate-spin"></span>
//       </span>
//     ) : (
//       t("common.continue")
//     )}
//   </button>
// </form>
