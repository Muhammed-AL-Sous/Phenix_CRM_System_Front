import React from "react";

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({
  size = 20,
  className,
  viewBox = "0 0 24 24",
  children,
  ...rest
}) {
  return (
    <svg
      {...base}
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconUsers({ size = 20, className }) {
  // User provided icon, converted from fill to outline
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <path
        d="M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3m14-3c0-1.23-1.234-2.287-3-2.75M3 17c0-1.23 1.234-2.287 3-2.75m12-4.014a3 3 0 1 0-4-4.472m-8 4.472a3 3 0 0 1 4-4.472M12 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}

export function IconAllUsers({ size = 20, className }) {
  // User provided icon (already outline), normalized to strokeWidth=2
  return (
    <Svg size={size} className={className} viewBox="0 0 16 16">
      <path
        fill="none"
        stroke="currentColor"
        d="M10.8 14v-1.7a2 2 0 0 0-2-2H7.2a2 2 0 0 0-2 2V14m9.3-3.5V9.3a2 2 0 0 0-2-2H11m-9.5 3.2V9.3a2 2 0 0 1 2-2H5m4.605-.195a1.605 1.605 0 1 1-3.21 0a1.605 1.605 0 0 1 3.21 0Zm3.8-3a1.605 1.605 0 1 1-3.21 0a1.605 1.605 0 0 1 3.21 0Zm-7.5 0a1.605 1.605 0 1 1-3.21 0a1.605 1.605 0 0 1 3.21 0Z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}

export function IconStaff({ size = 20, className }) {
  // User provided icon (already outline), normalized to strokeWidth=2
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      >
        <path
          fillRule="evenodd"
          d="M12 2.5a5.75 5.75 0 0 0-5.75 5.75V17H0V8h3.754a8.25 8.25 0 0 1 16.492 0H24v9h-3.824a6.75 6.75 0 0 1-6.676 5.75h-.25V24h-2.5v-5h2.5v1.25h.25A4.25 4.25 0 0 0 17.75 16V8.25A5.75 5.75 0 0 0 12 2.5"
          clipRule="evenodd"
        />
      </g>
    </Svg>
  );
}

export function IconClients({ size = 20, className }) {
  // User provided icon, converted from fill to outline
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <path
        d="M2.25 6a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0M4.5 9.75A3.75 3.75 0 0 0 .75 13.5v2.25h1.5l.75 6h3M17.25 6a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 0 0-4.5 0m2.25 3.75a3.75 3.75 0 0 1 3.75 3.75v2.25h-1.5l-.75 6h-3m-9-18a3 3 0 1 0 6 0a3 3 0 0 0-6 0m8.25 9.75a5.25 5.25 0 1 0-10.5 0v2.25H9l.75 7.5h4.5l.75-7.5h2.25z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}
