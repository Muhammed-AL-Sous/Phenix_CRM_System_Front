// React Redux
import { useDispatch, useSelector } from "react-redux";

// Language Toggle
import { setLang } from "../../store/Slices/uiSlice";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const { lang, direction } = useSelector((state) => state.ui);
  return (
    <div>
      <button
        onClick={() => dispatch(setLang(lang === "ar" ? "en" : "ar"))}
        className="text-sm font-medium text-gray-800
                     dark:text-white cursor-pointer group"
        style={{
          fontFamily: direction === "rtl" ? "Almarai" : "Inter",
        }}
      >
        {lang === "ar" ? "EN" : "AR"}
        <span
          className="block h-0.5 w-0 group-hover:w-full transition-all
         duration-500 bg-[#ed1c24]"
        />
      </button>
    </div>
  );
};

export default LanguageToggle;
