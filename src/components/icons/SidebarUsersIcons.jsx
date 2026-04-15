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
        d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"
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
        <path d="M2.01 5.102a2.184 2.184 0 1 0 4.368 0a2.184 2.184 0 0 0-4.368 0m5.628 5.082a3.743 3.743 0 0 0-5.628-1.57m15.612-3.512a2.184 2.184 0 1 0 4.368 0a2.184 2.184 0 0 0-4.368 0m-1.26 5.082a3.743 3.743 0 0 1 5.628-1.57M8.663 4.087a3.337 3.337 0 1 0 6.674 0a3.337 3.337 0 0 0-6.674 0" />
        <path d="M17.773 11.46a7.807 7.807 0 0 0-11.546 0m9.728 2.396a3.956 3.956 0 0 1-7.911 0" />
        <path d="M21.394 13.852v1.487l-1.7.34a7.8 7.8 0 0 1-.973 2.33l.969 1.444l-2.1 2.1l-1.443-.969a7.8 7.8 0 0 1-2.334.979l-.336 1.691h-2.96l-.337-1.691a7.8 7.8 0 0 1-2.333-.979l-1.447.965l-2.1-2.1l.969-1.444a7.8 7.8 0 0 1-.974-2.33l-1.7-.34v-1.483" />
      </g>
    </Svg>
  );
}

export function IconClients({ size = 20, className }) {
  // User provided icon, converted from fill to outline
  return (
    <Svg size={size} className={className} viewBox="0 0 640 640">
      <path
        d="M320 64c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64m96 312c0 25-12.7 47-32 59.9V528c0 26.5-21.5 48-48 48h-32c-26.5 0-48-21.5-48-48v-92.1C236.7 423 224 401 224 376v-40c0-53 43-96 96-96s96 43 96 96zM160 96c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56m16 240v32c0 32.5 12.1 62.1 32 84.7V528c0 1.2 0 2.5.1 3.7c-8.5 7.6-19.7 12.3-32.1 12.3h-32c-26.5 0-48-21.5-48-48v-56.6c-19.1-11-32-31.7-32-55.4v-32c0-53 43-96 96-96c12.7 0 24.8 2.5 35.9 6.9c-12.6 21.4-19.9 46.4-19.9 73.1m256 192v-75.3c19.9-22.5 32-52.2 32-84.7v-32c0-26.7-7.3-51.6-19.9-73.1c11.1-4.5 23.2-6.9 35.9-6.9c53 0 96 43 96 96v32c0 23.7-12.9 44.4-32 55.4V496c0 26.5-21.5 48-48 48h-32c-12.3 0-23.6-4.6-32.1-12.3c0-1.2.1-2.5.1-3.7m48-432c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56"
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
