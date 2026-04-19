import { Toaster } from "sonner";
import { useSelector } from "react-redux";

/**
 * ضع `<SonnerToaster />` مرة واحدة بجانب جذر الواجهة (مثل UIProvider).
 * أزل `<Toaster />` الخاص بـ react-hot-toast إن اعتمدت Sonner فقط.
 */
const SonnerToaster = () => {
  const { mode, direction } = useSelector((state) => state.ui);

  return (
    <Toaster
      position={direction === 'rtl' ? 'bottom-left' : 'bottom-right'}
      duration={4000}
      theme={mode === "dark" ? "dark" : "light"}
      dir={direction}
      // closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            direction === "rtl"
              ? "font-[Almarai] text-[14px] shadow-lg"
              : "font-[Livvic] text-[14px] shadow-lg",
          title: "font-semibold leading-snug",
          // closeButton:
            // "bg-black/5 dark:bg-white/10 border-0 hover:bg-black/10 dark:hover:bg-white/15",
        },
        style: {
          borderRadius: "12px",
        },
      }}
    />
  );
};

export default SonnerToaster;
