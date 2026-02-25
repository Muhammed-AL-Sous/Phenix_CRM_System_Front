import { animate, easeOut, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

/**
 * استخراج الرقم من أي تنسيق (50+, 99%, 24/10)
 */
function extractNumber(value) {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * تحديد نوع التنسيق
 */
function detectFormat(value) {
  if (value.includes("/")) return "fraction";
  if (value.includes("+")) return "plus";
  if (value.includes("%")) return "percent";
  return "number";
}

/**
 * تنسيق الرقم حسب النوع
 */
function formatValue(type, baseValue, number) {
  switch (type) {
    case "fraction": {
      const [, denominator] = baseValue.split("/");
      return `${number}/${denominator}`;
    }
    case "plus":
      return `${number}+`;
    case "percent":
      return `${number}%`;
    default:
      return number.toString();
  }
}

export function AnimatedStat({ value, duration = 1.8 }) {
  const ref = useRef(null);

  // تحسين للأداء: لا يعيد التفعيل عند scroll خفيف
  const isInView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  const numericValue = useMemo(() => extractNumber(value), [value]);
  const formatType = useMemo(() => detectFormat(value), [value]);

  const motionValue = useMotionValue(0);

  // البداية دائماً من صفر بدون glitch
  const [display, setDisplay] = useState(() =>
    formatValue(formatType, value, 0),
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, numericValue, {
      duration,
      ease: easeOut,
      // ease: [0.22, 1, 0.36, 1], // cubic-bezier احترافي
    });

    return controls.stop;
  }, [isInView, numericValue, duration, motionValue]);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      const rounded = Math.floor(latest);
      setDisplay(formatValue(formatType, value, rounded));
    });

    return unsubscribe;
  }, [motionValue, formatType, value]);

  return (
    <span
      ref={ref}
      style={{
        display: "inline-block",
        minWidth: "2ch", // يمنع القفز البصري
      }}
    >
      {display}
    </span>
  );
}
