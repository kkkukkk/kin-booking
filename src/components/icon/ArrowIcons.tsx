interface ArrowIconProps {
  className?: string;
}

export const ArrowLeftIcon = ({ className = "w-5 h-5" }: ArrowIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={`bi bi-arrow-left ${className}`} viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
  </svg>
);

export const ArrowRightIcon = ({ className = "w-5 h-5" }: ArrowIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-arrow-right ${className}`} viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
  </svg>
);

export const ArrowUpIcon = ({ className = "w-5 h-5" }: ArrowIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-arrow-up ${className}`} viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
  </svg>
);

export const ArrowDownIcon = ({ className = "w-5 h-5" }: ArrowIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`bi bi-arrow-down ${className}`} viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
  </svg>
); 