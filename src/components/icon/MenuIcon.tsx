import React from 'react';

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <line x1="4" x2="20" y1="7" y2="7" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" x2="20" y1="12" y2="12" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" x2="20" y1="17" y2="17" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default MenuIcon; 