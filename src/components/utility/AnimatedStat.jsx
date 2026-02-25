import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function extractNumber(value) {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function AnimatedStat({ value, duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const numericValue = extractNumber(value);
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, numericValue, {
      duration,
      ease: "easeOut", // أنعم من linear
      //   ease: [0.22, 1, 0.36, 1] // cubic-bezier احترافي جداً
    });

    return controls.stop;
  }, [isInView, numericValue]);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      const rounded = Math.floor(latest);

      if (value.includes("/")) {
        const parts = value.split("/");
        setDisplay(`${rounded}/${parts[1]}`);
      } else if (value.includes("+")) {
        setDisplay(`${rounded}+`);
      } else if (value.includes("%")) {
        setDisplay(`${rounded}%`);
      } else {
        setDisplay(rounded.toString());
      }
    });

    return () => unsubscribe();
  }, [motionValue, value]);

  return <span ref={ref}>{display}</span>;
}
