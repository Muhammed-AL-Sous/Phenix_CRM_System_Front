import { useState, useRef, useEffect } from "react";

// Motion Library
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";

const Dropdown = ({
  trigger,
  items = [],
  align = "right", // right | left
  width = "w-48",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { direction } = useSelector((state) => state.ui);
  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 ${width} rounded-xl shadow-lg p-2 bg-white dark:bg-zinc-900 backdrop-blur-xl ring-1 ring-black/5 z-50
           ${align === "right" ? "right-0" : "left-0"}`}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    closeDropdown();
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-xl flex items-center gap-3"
                  style={{
                    fontFamily: direction === "rtl" ? "Vazirmatn" : "Almarai",
                    fontSize: direction === "rtl" ? "13px" : "",
                    padding: direction === "rtl" ? "10px" : "",
                  }}
                >
                  <span>
                    {item.icon && (
                      <item.icon
                        size={18}
                        className="text-gray-700 dark:text-gray-200"
                      />
                    )}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
