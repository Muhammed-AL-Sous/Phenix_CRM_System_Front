import React, { useEffect, useRef } from "react";

export const RevealSection = ({ children, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        transition: "all 0.8s ease-out",
      }}
    >
      {children}
    </section>
  );
};
