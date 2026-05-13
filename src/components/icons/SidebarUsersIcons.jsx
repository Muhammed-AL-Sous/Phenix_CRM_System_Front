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

export function IconAddUser({ size = 20, className }) {
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <g strokeDasharray="22" strokeDashoffset="22">
          <path d="M3 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.3s"
              values="22;0"
            />
          </path>
          <path d="M9 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.3s"
              dur="0.3s"
              values="22;0"
            />
          </path>
        </g>
        <g strokeDasharray="10" strokeDashoffset="10">
          <path d="M15 6h6">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.7s"
              dur="0.2s"
              to="0"
            />
          </path>
          <path d="M18 3v6">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.9s"
              dur="0.2s"
              to="0"
            />
          </path>
        </g>
      </g>
    </Svg>
  );
}

export function IconEditUser({ size = 20, className }) {
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {/* الرأس - دائرة كاملة */}
        <circle cx="12" cy="7" r="3" strokeDasharray="20" strokeDashoffset="20">
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.4s"
            values="20;0"
          />
        </circle>

        {/* الجسم المنحني - الكتف الأيسر */}
        <path
          strokeDasharray="15"
          strokeDashoffset="15"
          d="M6 18c0-5 1.5-3.5 7-4"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.4s"
            dur="0.3s"
            values="15;0"
          />
        </path>

        {/* القلم - بشكل كبسولة مغلقة */}
        <path
          strokeDasharray="25"
          strokeDashoffset="25"
          d="M13 18l5 -5c.8-.8 2-.8 2.8 0s.8 2 0 2.8l-5 5l-2.8 .5l.5 -2.8Z"
          fill="none"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.5s"
            values="25;0"
          />
        </path>
      </g>
    </Svg>
  );
}

export function IconDeleteUser({ size = 20, className }) {
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <g strokeDasharray="22">
          <path d="M3 21v-1c0 -2.21 1.79 -4 4 -4h4c2.21 0 4 1.79 4 4v1">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.3s"
              values="22;0"
            />
          </path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            strokeDasharray="22"
            strokeDashoffset="22"
            d="M9 13c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3Z"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.3s"
              dur="0.3s"
              to="0"
            />
          </path>
        </g>
        <g strokeDasharray="12" strokeDashoffset="12">
          <path d="M15 3l6 6">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.7s"
              dur="0.2s"
              to="0"
            />
          </path>
          <path d="M21 3l-6 6">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.9s"
              dur="0.2s"
              to="0"
            />
          </path>
        </g>
      </g>
    </Svg>
  );
}

export function IconAdmin({ size = 20, className }) {
  return (
    <Svg size={size} className={className} viewBox="0 0 24 24">
      <path
        d="M12 23C6.443 21.765 2 16.522 2 11V5l10-4l10 4v6c0 5.524-4.443 10.765-10 12M4 6v5a10.58 10.58 0 0 0 8 10a10.58 10.58 0 0 0 8-10V6l-8-3Z"
        fill="none"
      />
      <circle cx="12" cy="8.5" r="2.5" fill="currentColor" />
      <path
        fill="currentColor"
        d="M7 15a5.78 5.78 0 0 0 5 3a5.78 5.78 0 0 0 5-3c-.025-1.896-3.342-3-5-3c-1.667 0-4.975 1.104-5 3"
      />
    </Svg>
  );
}

export function IconSupport({ size = 20, className }) {
  return (
    <Svg size={size} className={className} viewBox="0 0 48 48">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <path d="M30.24 6.212q.387.213.76.444c4.937 3.058 8.238 8.46 8.313 14.63l3.747 5.223c.563.785.465 1.846-.363 2.344c-.83.5-2.063 1.084-3.734 1.488l-.566 6.718a3 3 0 0 1-3.358 2.725l-2.8-.346V43a2 2 0 0 1-1.998 2H13.014a2 2 0 0 1-1.999-2v-7.5c-4.295-3.192-7.075-8.275-7.075-14c0-6.26 3.321-11.75 8.315-14.844" />
        <path d="M17.023 14.057a8 8 0 1 0 7.954 0Q24.998 12.738 25 11c0-2.551-.044-4.405-.09-5.645c-.043-1.2-.854-2.187-2.05-2.285A24 24 0 0 0 21 3c-.732 0-1.35.029-1.86.07c-1.196.098-2.007 1.085-2.05 2.285C17.043 6.595 17 8.449 17 11q.001 1.739.023 3.057" />
        <path d="M21 29c3 3 7.6 5 12 5" />
      </g>
    </Svg>
  );
}
