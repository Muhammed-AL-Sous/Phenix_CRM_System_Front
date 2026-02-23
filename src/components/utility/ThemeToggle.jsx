// React Redux
import { useDispatch, useSelector } from "react-redux";

// Mode Toggle
import { toggleMode } from "../../store/Slices/uiSlice";

// Icons
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.ui);

  return (
    <div>
      {/* Dark Mode */}
      <button
        onClick={() => dispatch(toggleMode())}
        className="text-gray-700 dark:text-white
         hover:text-[#ed1c24] relative top-1"
      >
        {mode === "dark" ? (
          // Light Button
          <Sun className="cursor-pointer" />
        ) : (
          // Dark Button
          <Moon className="cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
