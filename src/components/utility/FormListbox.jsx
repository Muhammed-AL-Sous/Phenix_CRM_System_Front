import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
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
  const [filter, setFilter] = useState("");
  const [floatingStyle, setFloatingStyle] = useState(null);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const { direction } = useSelector((state) => state.ui);
  const isRtl = direction === "rtl";

  const computeFloatingStyle = useCallback(() => {
    const trigger = rootRef.current;
    if (!trigger) return null;

    const GAP = 8;
    const MAX_PANEL = 288;

    const r = trigger.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - GAP;
    const above = r.top - GAP;
    const openUp = below < 240 && above > below;

    let maxH;
    if (openUp) {
      maxH = Math.min(MAX_PANEL, Math.max(100, above - GAP));
      // Pin panel bottom to just above the trigger so short lists sit flush
      // (using `top` + maxHeight assumed full height and left a large gap).
      return {
        position: "fixed",
        left: r.left,
        width: r.width,
        bottom: window.innerHeight - r.top + GAP,
        maxHeight: maxH,
        zIndex: 100,
      };
    }

    maxH = Math.min(MAX_PANEL, Math.max(100, below - GAP));
    return {
      position: "fixed",
      left: r.left,
      width: r.width,
      top: r.bottom + GAP,
      maxHeight: maxH,
      zIndex: 100,
    };
  }, []);

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

  /** Portal + fixed position avoids clipping inside dashboard <main overflow-y-auto> */
  useLayoutEffect(() => {
    if (disabled || loading || !open) {
      return undefined;
    }
    const updatePlacement = () => setFloatingStyle(computeFloatingStyle());
    window.addEventListener("resize", updatePlacement);
    const scrollRoots = [];
    let el = rootRef.current?.parentElement;
    while (el) {
      scrollRoots.push(el);
      el = el.parentElement;
    }
    scrollRoots.forEach((node) => {
      node.addEventListener("scroll", updatePlacement, { passive: true, capture: true });
    });
    return () => {
      window.removeEventListener("resize", updatePlacement);
      scrollRoots.forEach((node) => {
        node.removeEventListener("scroll", updatePlacement, { capture: true });
      });
    };
  }, [open, disabled, loading, computeFloatingStyle]);

  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target;
      const root = rootRef.current;
      const panel = panelRef.current;
      if (root?.contains(t) || panel?.contains(t)) return;
      closePanel();
    };
    // Use mousedown so clicks that open the panel don't also trigger this and immediately close it again.
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [closePanel]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  const displayLabel = loading ? placeholder : selected?.name || placeholder;

  const portalTarget =
    typeof document !== "undefined" ? document.body : null;

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
            const next = !prev;
            if (next) {
              setFloatingStyle(computeFloatingStyle());
            } else {
              setFilter("");
            }
            return next;
          });
        }}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-start text-sm leading-normal text-slate-800 outline-none transition focus:ring-2 focus:ring-red-500/70 dark:focus:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="min-w-0 flex-1 truncate text-sm leading-normal [unicode-bidi:plaintext]"
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

      {portalTarget &&
        createPortal(
          <AnimatePresence onExitComplete={() => setFloatingStyle(null)}>
            {open && !disabled && !loading && floatingStyle && (
              <motion.div
                key="form-listbox-panel"
                ref={panelRef}
                dir={isRtl ? "rtl" : "ltr"}
                style={floatingStyle}
                initial={{
                  opacity: 0,
                  y: "bottom" in floatingStyle ? 6 : -6,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: "bottom" in floatingStyle ? 6 : -6,
                }}
                transition={{ duration: 0.15 }}
                className="flex flex-col overflow-hidden rounded-xl bg-white text-sm shadow-lg ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900 dark:ring-white/10"
                role="listbox"
              >
                {options.length > 12 && (
                  <div className="shrink-0 border-b border-slate-100 p-2 dark:border-zinc-800">
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
                <div className="min-h-0 flex-1 overflow-y-auto py-1">
                  {filtered.length === 0 ? (
                    <div
                      className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
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
                        className={`w-full px-3 py-2 text-start text-sm leading-normal transition hover:bg-slate-100 dark:hover:bg-zinc-800 ${
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
          </AnimatePresence>,
          portalTarget,
        )}
    </div>
  );
};

export default FormListbox;
