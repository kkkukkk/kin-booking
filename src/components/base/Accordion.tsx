import React, { useState, ReactNode, useRef } from 'react';
import clsx from 'clsx';
import ThemeDiv from '@/components/base/ThemeDiv';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, className }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeDiv className={clsx('rounded shadow-sm transition-all', className)} isChildren>
      <button
        type="button"
        className={clsx(
          'w-full flex justify-between items-center px-4 py-2 text-left font-semibold rounded focus:outline-none',
          open && 'hover:bg-opacity-80'
        )}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span
          className={clsx(
            'ml-2 text-base transition-transform duration-300',
            open ? 'rotate-180' : 'rotate-0'
          )}
        >
          ▼
        </span>
      </button>
      <div
        ref={contentRef}
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          open
            ? 'opacity-100 max-h-[500px] rounded-b-lg delay-100'
            : 'opacity-0 max-h-0 delay-0'
        )}
      >
        <div className="px-4 py-3 text-sm">
          {children}
        </div>
      </div>
    </ThemeDiv>
  );
};

export default Accordion; 