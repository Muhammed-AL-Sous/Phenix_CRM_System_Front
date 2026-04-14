import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

/**
 * Select-style list matching Dropdown.jsx visuals (rounded panel, motion, ring).
 * Options: { id, name } as returned by lookups APIs.
 */
const FormListbox = ({
  value,
  onChange,
  options = [],
  placeholder = "",
  disabled = false,
  loading = false,
  emptyLabel = "",
  /** When options exist but search filter hides all of them */
  filterEmptyLabel = "",
  id: idProp,
  filterPlaceholder = "",
}) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [filter, setFilter] = useState("");
  const rootRef = useRef(null);
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  const selected = useMemo(
    () => options.find((o) => String(o.id) === String(value)),
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => String(o.name || "").toLowerCase().includes(q));
  }, [options, filter]);

  const closePanel = useCallback(() => {
    setOpen(false);
    setFilter("");
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const updatePlacement = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Heuristic: if not enough room below, open upwards.
      // 320px ~ dropdown (mt + panel + safe space).
      const shouldOpenUp = window.innerHeight - rect.bottom < 320;
      setOpenUp(shouldOpenUp);
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    // Capture scroll events from any scroll container.
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [closePanel]);

  const displayLabel = loading ? placeholder : selected?.name || placeholder;

  return (
    <div
      className="relative w-full"
      ref={rootRef}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <button
        type="button"
        id={idProp}
        dir={isRtl ? "rtl" : "ltr"}
        disabled={disabled || loading}
        onClick={() => {
          if (disabled || loading) return;
          setOpen((prev) => {
            if (prev) setFilter("");
            return !prev;
          });
        }}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-start text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="min-w-0 flex-1 truncate [unicode-bidi:plaintext]"
          style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              {placeholder}
            </span>
          ) : (
            displayLabel
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 opacity-60 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && !disabled && !loading && (
          <motion.div
            dir={isRtl ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: openUp ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUp ? 5 : -5 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 max-h-72 w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900 dark:ring-white/10 ${
              openUp ? "bottom-full mb-2" : "top-full mt-2"
            } ${isRtl ? "right-0" : "left-0"}`}
            role="listbox"
          >
            {options.length > 12 && (
              <div className="border-b border-slate-100 p-2 dark:border-zinc-800">
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={filterPlaceholder}
                  dir={isRtl ? "rtl" : "ltr"}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div
                  className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400"
                  style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
                >
                  {options.length === 0
                    ? emptyLabel || placeholder
                    : filterEmptyLabel || emptyLabel || placeholder}
                </div>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    dir={isRtl ? "rtl" : "ltr"}
                    role="option"
                    aria-selected={String(o.id) === String(value)}
                    onClick={() => {
                      onChange(String(o.id));
                      closePanel();
                    }}
                    className={`w-full px-4 py-2.5 text-start text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-800 ${
                      String(o.id) === String(value)
                        ? "bg-red-50 font-medium text-red-700 dark:bg-red-950/40 dark:text-red-200"
                        : "text-slate-800 dark:text-slate-100"
                    }`}
                    style={{ fontFamily: isRtl ? "Vazirmatn" : "Inter" }}
                  >
                    {o.name}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormListbox;
