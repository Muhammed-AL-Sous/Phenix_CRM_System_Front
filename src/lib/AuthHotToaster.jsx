import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

/**
 * مكوّن react-hot-toast لمسارات المصادقة فقط (AuthLayout).
 */
const AuthHotToaster = () => {
  const { mode, direction } = useSelector((state) => state.ui);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: direction === "rtl" ? "font-[Vazirmatn]" : "font-[Inter]",
        style: {
          direction: direction,
          borderRadius: "12px",
          background: mode === "dark" ? "#27272a" : "#fff",
          color: mode === "dark" ? "#fff" : "#18181b",
          fontSize: "14px",
        },
      }}
    />
  );
};

export default AuthHotToaster;
