interface ChairIconProps {
  className?: string;
}

export const ChairIcon = ({ className = "w-5 h-5" }: ChairIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-chair ${className}`} viewBox="0 0 16 16">
    <path d="M4 1a2 2 0 0 0-2 2v7.5a.5.5 0 0 0 1 0V9h10v1.5a.5.5 0 0 0 1 0V3a2 2 0 0 0-2-2H4zm8 7V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5h8z"/>
    <path d="M2.5 13a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-1 0v-1.5a.5.5 0 0 1 .5-.5zm11 0a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-1 0v-1.5a.5.5 0 0 1 .5-.5z"/>
  </svg>
); 