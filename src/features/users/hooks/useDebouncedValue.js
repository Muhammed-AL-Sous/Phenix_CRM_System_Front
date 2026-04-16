import { useEffect, useRef, useState } from "react";

/**
 * @template T
 * @param {T} value
 * @param {number} delayMs
 * @param {() => void} [onSettled] يُستدعى بعد تحديث القيمة المؤجلة (مثلاً إعادة ترقيم الصفحة عند البحث)
 * @returns {T}
 */
export function useDebouncedValue(value, delayMs = 400, onSettled) {
  const [debounced, setDebounced] = useState(value);
  const onSettledRef = useRef(onSettled);
  const skipFirstSettled = useRef(true);

  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebounced(value);
      if (skipFirstSettled.current) {
        skipFirstSettled.current = false;
        return;
      }
      onSettledRef.current?.();
    }, delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
