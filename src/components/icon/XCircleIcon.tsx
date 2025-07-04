import React from 'react';

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
    <path d="M9 9l6 6M15 9l-6 6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default XCircleIcon; 